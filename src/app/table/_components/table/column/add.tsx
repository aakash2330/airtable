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

function generateTemporaryId() {
  return "temp-" + Math.random().toString(36).substr(2, 9);
}

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
  const [tempColumnName, setTempColumnName] = useState("");
  const addColumnMutation = api.table.addColumnToTable.useMutation({
    onMutate: async () => {
      setColumns((prev) => {
        const prevCopy = [...prev];
        //insert at second last position cause last column is addColumn one
        prevCopy.splice(prevCopy.length - 1, 0, {
          accessorKey: columnName,
          header: columnName,
          size: 200,
        });
        return prevCopy;
      });

      console.log("setting new Data");
      setData((prev) => {
        const updatedRows = prev.map((row, index) => {
          return {
            ...row,
            [columnName]: {
              value: "",
              cellId: generateTemporaryId(),
            },
          };
        });
        return updatedRows;
      });
    },
    onSuccess: async ({ data: { transactionData } }) => {
      await utils.table.invalidate();
      // add the new transaction to the table states / data states

      //add new column to state
      const createdColumnName = transactionData.createdColumn.name;

      // Find the index of the temporary column (second last position)
      const tempColumnIndex = columns.length - 1; // Assuming last column is AddColumn

      // Replace the temporary column with the actual column
      setColumns((prevColumns) => {
        const prevCopy = [...prevColumns];
        prevCopy.splice(tempColumnIndex, 1, {
          accessorKey: createdColumnName,
          header: createdColumnName,
          size: 200,
        });
        return prevCopy;
      });

      setData((prevData) => {
        const updatedRows = prevData.map((row, index) => {
          const tempCell = row[tempColumnName];
          const actualCellId = _.get(
            transactionData,
            [`createdCells`, index, "id"],
            null,
          );

          return {
            ...row,
            [createdColumnName]: {
              value: tempCell?.value ?? "",
              cellId: actualCellId ? actualCellId : generateTemporaryId(),
            },
            // Remove the temporary column
            ...(tempColumnName in row ? { [tempColumnName]: undefined } : {}),
          };
        });

        // Remove any undefined keys resulting from temporary column removal
        return updatedRows.map((row) => _.omit(row, [tempColumnName]));
      });

      // Optionally, trigger a refetch to ensure data consistency
      await utils.table.invalidate();
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
