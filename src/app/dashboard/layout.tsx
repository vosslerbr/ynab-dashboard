import { getSession } from "@/server/better-auth/server";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();

  if (!session) redirect("/sign-in");

  return <>{children}</>;
}
