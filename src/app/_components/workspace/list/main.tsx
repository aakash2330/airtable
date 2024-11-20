import { Button } from "@/components/ui/button";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import Link from "next/link";

export async function WorkspaceList() {
  const session = await auth();
  if (session) {
    const allWorkspacesList = await api.workspace.getAllWorkspacesList();
    return (
      <div>
        Your Workspaces
        {allWorkspacesList.map((workspace) => {
          return (
            <Button key={workspace.id}>
              <Link
                href={`/table/${workspace.id}?${!!workspace.tables.length ? "sheet=" + workspace.tables[0]?.id : ""}`}
              >
                {workspace.name}
              </Link>
            </Button>
          );
        })}
      </div>
    );
  } else {
    return <div>please login to see your workspaces</div>;
  }
}
