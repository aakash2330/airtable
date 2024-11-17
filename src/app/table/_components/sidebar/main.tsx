import { Check, Table } from "lucide-react";
import { ViewSearchInput } from "../hero/_components/view-search/main";

export function TableSidebar() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 border-t-[1px] p-4">
      <div className="flex w-full flex-col items-center justify-center">
        <ViewSearchInput></ViewSearchInput>
      </div>
      <div className="flex h-8 w-full items-center bg-[#C4ECFFB3] p-2 text-sm">
        <div className="flex flex-1 items-center gap-2">
          <Table color="#176ee1" size={16} strokeWidth={1.3}></Table>
          Grid view
        </div>
        <Check size={16} strokeWidth={1}></Check>
      </div>
    </div>
  );
}
