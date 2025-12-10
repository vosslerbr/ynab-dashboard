import { Button } from "@/components/ui/button";
import { auth } from "@/server/better-auth";
import { getSession } from "@/server/better-auth/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SignInOutButton() {
  const session = await getSession();

  if (!session) {
    return (
      <form>
        <Button
          variant="secondary"
          formAction={async () => {
            "use server";
            const res = await auth.api.signInSocial({
              body: {
                provider: "ynab",
                callbackURL: "/",
              },
            });

            if (!res.url) {
              throw new Error("No URL returned from signInSocial");
            }
            redirect(res.url);
          }}
        >
          Sign in
        </Button>
      </form>
    );
  }

  return (
    <form>
      <Button
        variant="secondary"
        formAction={async () => {
          "use server";
          await auth.api.signOut({
            headers: await headers(),
          });
          redirect("/");
        }}
      >
        Sign out
      </Button>
    </form>
  );
}
