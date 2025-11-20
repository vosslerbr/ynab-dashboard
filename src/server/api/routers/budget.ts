import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const budgetRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async () => {
      return {
        greeting: `Hello world`,
      };
    }),
});
