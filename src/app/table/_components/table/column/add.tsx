import { Plus } from "lucide-react";
import { OptionsMenuDropdown } from "../../options-menu/dropdown/main";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { type ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { api } from "@/trpc/react";
import { type CellData } from "@/validators/table";
import { clearCache } from "@/app/actions/clear-cache";

//TODO:https://stackoverflow.com/questions/74671735/optimistic-updates-with-react-query-trpc

//NOTE:Turn to optimistic updates so that the table functions are snappier

export function AddColumn({
  setColumns,
  columns,
  tableId,
}: {
  setColumns: React.Dispatch<
    React.SetStateAction<ColumnDef<Record<string, CellData>>[]>
  >;
  columns: ColumnDef<Record<string, CellData>>[];
  tableId: string;
}) {
  const utils = api.useUtils();
  const [columnName, setColumnName] = useState("");
  const addColumnMutation = api.table.addColumnToTable.useMutation({
    onSuccess: async ({ data: { addedColumn } }) => {
      if (!addedColumn) {
        alert("column creation failed");
      }

      await utils.table.invalidate();
      await clearCache()
      // setColumns((prev) => {
      //   return [
      //     ...prev,
      //     {
      //       accessorKey: columnName,
      //       header: columnName,
      //       size: 200,
      //     },
      //   ];
      // });
    },
    onError: () => {
      alert("Column creation failed");
    },
  });
  async function addNewColumn() {
    addColumnMutation.mutate({
      tableId,
      position: columns.length,
      dataType: "string",
      columnName,
    });
  }
  return (
    <OptionsMenuDropdown
      title={
        <>
          <Plus size={18} strokeWidth={1}></Plus>
        </>
      }
      content={
        <>
          <DropdownMenuLabel>Create New Column</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Input
            onChange={(e) => {
              setColumnName(e.target.value);
            }}
          ></Input>
          <DropdownMenuItem onClick={addNewColumn}>
            <div className="flex w-full min-w-20 items-center justify-center">
              Create
            </div>
          </DropdownMenuItem>
        </>
      }
    ></OptionsMenuDropdown>
  );
}
