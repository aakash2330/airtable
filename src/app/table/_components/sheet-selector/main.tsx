"use client";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ChevronDown, Plus } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const sheetsData = [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }].map(
  (sheet) => ({
    id: sheet.id,
    render: <Link href={`/table?sheet=${sheet.id}`}>{`sheet${sheet.id}`}</Link>,
  }),
);

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
  return (
    <div className="flex h-8 justify-between gap-2 bg-table-primary">
      <div className="flex h-full flex-1 items-center justify-start rounded-md bg-table-secondary pl-4">
        {sheetsData.map((item) => {
          return (
            <div
              key={item.id}
              className={cn(
                `flex h-full items-center justify-center gap-2 hover:bg-[#b3072f]`,

                searchParams.get("sheet") == item.id
                  ? "bg-white hover:bg-white hover:text-black"
                  : "",
              )}
            >
              <SheetSelectorTab item={item}></SheetSelectorTab>
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
            render: <Plus className="size-4 font-light" strokeWidth={1.5} />,
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
          ? "bg-white text-black hover:bg-white hover:text-black"
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
