import { Button } from "@/components/ui/button";
import { auth } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import { WorkspaceList } from "./_components/workspace/list/main";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center text-black">
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-center text-2xl text-white">
            {session && <span>Logged in as {session.user?.name}</span>}
          </p>
          <Link
            href={session ? "/api/auth/signout" : "/api/auth/signin"}
            className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
          >
            {session ? "Sign out" : "Sign in"}
          </Link>
          <div className="flex items-center justify-center gap-5">
            <Button>
              <Link href={"/table"}>Demo</Link>
            </Button>
            <MoveRight></MoveRight>
          </div>
        </div>
        <WorkspaceList></WorkspaceList>
      </main>
    </HydrateClient>
  );
}
