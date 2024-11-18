import { Table } from "lucide-react";
import { ViewSearchInput } from "../hero/_components/view-search/main";
import { TableSidebarCollapsible } from "./collapsible/main";
import { TableSidebarViewSelection } from "./sidebarButtons/main";

const createItemList = [
  {
    icon: <Table color="#176ee1" size={16} strokeWidth={1.3}></Table>,
    title: "Grid View",
    pill: false,
    hoverable: false,
  },
];

export function TableSidebar() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-between gap-2 border-t-[1px] p-4">
      <div className="w-full space-y-2">
        <div className="flex w-full flex-col items-center justify-center">
          <ViewSearchInput></ViewSearchInput>
        </div>
        {createItemList.map((item, index) => {
          return (
            <TableSidebarViewSelection
              key={index}
              item={item}
            ></TableSidebarViewSelection>
          );
        })}
      </div>
      <TableSidebarCollapsible></TableSidebarCollapsible>
    </div>
  );
}
