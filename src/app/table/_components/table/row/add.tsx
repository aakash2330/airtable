import { api } from "@/trpc/react";
import { type CellData } from "@/validators/table";
import { type ColumnDef } from "@tanstack/react-table";
import _ from "lodash";
import { Plus } from "lucide-react";

export function AddRow({
  columns,
  setData,
  tableId,
}: {
  columns: ColumnDef<Record<string, CellData>>[];
  setData: React.Dispatch<React.SetStateAction<Record<string, CellData>[]>>;
  tableId: string;
}) {
  const utils = api.useUtils();
  const addRowMutation = api.table.addRowToTable.useMutation({
    onSuccess: async ({ data: { transactionData } }) => {
      if (!transactionData) {
        alert("Row creation failed");
      }

      await utils.table.invalidate();

      // add the new transaction to the table states / data states

      // for each column , add the given cell in tableData
      console.log({ transactionData });
      setData((prev) => {
        // NOTE: this columns.length assertion should be made everywhere when adding a row
        if (transactionData.createdCells && !!columns.length) {
          const newRowdata = columns.reduce((acc, col, index) => {
            acc[col.accessorKey] = {
              value: "",
              cellId: _.get(
                transactionData,
                [`createdCells`, index, "id"],
                null,
              )
                ? _.get(transactionData, [`createdCells`, index, "id"])
                : Math.random().toString(),
            };
            return acc;
          }, {});
          return [
            ...prev,
            { ...newRowdata, id: transactionData.createdRow.id },
          ];
        }
        return prev;
      });
    },
    onError: () => {
      alert("Row creation failed");
    },
  });
  return (
    <div
      onClick={() => {
        addRowMutation.mutate({ tableId });
      }}
      className="hover:cursor-pointer hover:bg-neutral-100"
    >
      <div className="pl-1">
        <Plus size={18} strokeWidth={1}></Plus>
      </div>
      {new Array(columns.length).fill(null).map((item, index) => {
        return <div key={index}></div>;
      })}
    </div>
  );
}
