"use client";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AddTableDropdown } from "./_components/table/add";
import useSetQueryParams from "@/hooks/useSetQueryParams";

const sheetsDataOptions = [
  { id: "sheet-data-option-1", render: <p>Extensions</p> },
  {
    id: "sheet-data-option-2",
    render: (
      <div className="flex items-center justify-center gap-1">
        <p>Tools</p>
        <ChevronDown className="size-4 font-light" strokeWidth={1.5} />
      </div>
    ),
  },
];

export function SheetSelectorSection() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const setQueryParams = useSetQueryParams();

  const { data: workspaceTables, refetch } =
    api.workspace.getWorksheetTablesById.useQuery(
      { workspaceId },
      {
        enabled: !!workspaceId,
      },
    );

  useEffect(() => {
    const workspaceId = pathname.split("/")[2];
    if (workspaceId) {
      setWorkspaceId(workspaceId);
      refetch()
        .then(() => {
          console.log("refetched");
        })
        .catch(() => {
          console.log("error during refetch");
        });
    }
  }, [pathname, refetch]);
  return (
    <div className="flex h-8 justify-between gap-2 bg-table-primary">
      <div className="flex h-full flex-1 items-center justify-start rounded-md bg-table-secondary pl-4">
        {/* 
           TODO: Add loading skeleton here
           * */
        workspaceTables?.data.tables.map((item) => {
          return (
            <div
              key={item.id}
              className={cn(
                `flex h-full items-center justify-center gap-2 hover:bg-[#b3072f]`,

                searchParams.get("sheet") == item.id
                  ? "-rounded-b-md h-[115%] rounded-sm bg-white hover:bg-white hover:text-black"
                  : "",
              )}
            >
              <SheetSelectorTab
                item={{
                  id: item.id,
                  render: (
                    <div
                      onClick={() => {
                        setQueryParams({ sheet: item.id });
                      }}
                    >
                      {item.name}
                    </div>
                  ),
                }}
              ></SheetSelectorTab>
              <Separator
                className="h-3 bg-neutral-100/15"
                orientation="vertical"
              />
            </div>
          );
        })}

        <SheetSelectorTab
          size="sm"
          item={{
            render: (
              <ChevronDown className="size-4 font-light" strokeWidth={1.5} />
            ),
            id: "chev-down",
          }}
        ></SheetSelectorTab>
        <Separator className="h-3 bg-neutral-100/15" orientation="vertical" />
        <SheetSelectorTab
          size="sm"
          item={{
            render: (
              <AddTableDropdown workspaceId={workspaceId}></AddTableDropdown>
            ),
            id: "plus",
          }}
        ></SheetSelectorTab>
      </div>
      <div className="flex h-full w-[11%] items-center justify-start gap-3 rounded-md bg-table-secondary pl-2">
        {sheetsDataOptions.map((item) => {
          return (
            <SheetSelectorTabOptions
              key={item.id}
              item={item}
            ></SheetSelectorTabOptions>
          );
        })}
      </div>
    </div>
  );
}

export function SheetSelectorTab({
  item,
  size,
}: {
  item: { render: JSX.Element; id: string };
  size?: "sm" | "md";
}) {
  const searchParams = useSearchParams();
  return (
    <div
      className={cn(
        `flex h-full ${size == "sm" ? "w-12" : "w-16"} items-center justify-center text-[13px] text-neutral-200 hover:cursor-pointer hover:bg-[#b3072f]`,
        searchParams.get("sheet") == item.id
          ? "rounded-sm bg-white text-black hover:bg-white hover:text-black"
          : "",
      )}
    >
      {item.render}
    </div>
  );
}

export function SheetSelectorTabOptions({
  item,
}: {
  item: { render: JSX.Element };
}) {
  return (
    <div
      className={`flex h-full w-full items-center justify-center text-[13px] text-neutral-200 hover:cursor-pointer hover:text-white`}
    >
      {item.render}
    </div>
  );
}
