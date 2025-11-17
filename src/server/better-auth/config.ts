import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { genericOAuth } from "better-auth/plugins";

import { env } from "@/env";
import { db } from "@/server/db";
import { nextCookies } from "better-auth/next-js";
import z from "zod";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),

  plugins: [
    nextCookies(),
    genericOAuth({
      config: [
        {
          providerId: "ynab",
          clientId: env.BETTER_AUTH_YNAB_CLIENT_ID,
          clientSecret: env.BETTER_AUTH_YNAB_CLIENT_SECRET,

          authorizationUrl: "https://app.ynab.com/oauth/authorize",
          tokenUrl: "https://app.ynab.com/oauth/token",

          scopes: ["read-only"],
          responseType: "code",

          getUserInfo: async (tokens) => {
            const res = await fetch("https://api.ynab.com/v1/user", {
              headers: {
                Authorization: `Bearer ${tokens.accessToken}`,
              },
            });

            const resJson = (await res.json()) as unknown;

            const { data, success, error } = z
              .object({
                data: z.object({ user: z.object({ id: z.string() }) }),
              })
              .safeParse(resJson);

            if (!success) throw error;

            const { id } = data.data.user;

            return {
              id,
              email: id,
              emailVerified: false,
              name: id,
            };
          },
        },
      ],
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;
