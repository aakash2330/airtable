import { Plus } from "lucide-react";
import { OptionsMenuDropdown } from "../../options-menu/dropdown/main";
import {
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { type ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { api } from "@/trpc/react";
import { type CellData } from "@/validators/table";
import { Button } from "@/components/ui/button";
import _ from "lodash";

//TODO:https://stackoverflow.com/questions/74671735/optimistic-updates-with-react-query-trpc

//NOTE:Turn to optimistic updates so that the table functions are snappier

export function AddColumn({
  columns,
  tableId,
  setColumns,
  setData,
}: {
  setData: React.Dispatch<React.SetStateAction<Record<string, CellData>[]>>;
  setColumns: React.Dispatch<
    React.SetStateAction<ColumnDef<Record<string, CellData>>[]>
  >;
  columns: ColumnDef<Record<string, CellData>>[];
  tableId: string;
}) {
  const utils = api.useUtils();
  const [columnName, setColumnName] = useState("");
  const addColumnMutation = api.table.addColumnToTable.useMutation({
    onSuccess: async ({ data: { transactionData } }) => {
      if (!transactionData) {
        alert("column creation failed");
      }
      await utils.table.invalidate();

      // add the new transaction to the table states / data states

      //add new column to state
      setColumns((prev) => {
        const prevCopy = [...prev];
        //insert at second last position cause last column is addColumn one
        prevCopy.splice(prevCopy.length - 1, 0, {
          accessorKey: transactionData.createdColumn.name,
          header: transactionData.createdColumn.name,
          size: 200,
        });
        return prevCopy;
      });

      //add newlyCreated Cells to state
      setData((prev) => {
        const updatedRows = prev.map((row, index) => {
          return {
            ...row,
            [transactionData.createdColumn.name]: {
              value: "",
              cellId: _.get(
                transactionData,
                [`createdCells`, index, "id"],
                null,
              )
                ? _.get(transactionData, [`createdCells`, index, "id"])!
                : Math.random().toString(),
            },
          };
        });
        console.log({ updatedRows });
        return updatedRows;
      });
    },
    onError: (error) => {
      console.log({ error });
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
          <Button onClick={addNewColumn}>
            <div className="flex w-full min-w-20 items-center justify-center">
              Create
            </div>
          </Button>
        </>
      }
    ></OptionsMenuDropdown>
  );
}
