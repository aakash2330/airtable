import { api } from "@/trpc/react";
import { type CellData } from "@/validators/table";
import { type ColumnDef } from "@tanstack/react-table";
import _ from "lodash";
import { Plus } from "lucide-react";

// Helper function to generate a temporary ID
function generateTemporaryId() {
  return "temp-" + Math.random().toString(36).substr(2, 9);
}

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
    onMutate: async () => {
      // Create a temporary row with placeholder data
      const tempRowId = generateTemporaryId();
      setData((prev) => {
        const tempRow = columns.reduce(
          (acc, col) => {
            if (col.accessorKey != "index" && col.accessorKey != "addColumn") {
              acc[col.accessorKey] = {
                value: "",
                cellId: generateTemporaryId(),
              };
            }
            return acc;
          },
          {} as Record<string, CellData>,
        );
        return [...prev, { id: tempRowId, ...tempRow }];
      });

      return { tempRowId }; // Context for rollback
    },
    onSuccess: async ({ data: { transactionData } }, variables, context) => {
      const { tempRowId } = context;
      console.log("updating new rows");

      setData((prev) => {
        const updatedRows = prev.map((row) => {
          console.log(transactionData.createdCells);
          return row.id === tempRowId
            ? {
                ...row,
                id: transactionData.createdRow.id,
                ...columns.reduce(
                  (acc, col, index) => {
                    if (
                      col.accessorKey != "index" &&
                      col.accessorKey != "addColumn"
                    ) {
                      acc[col.accessorKey] = {
                        value: "",
                        cellId: _.get(
                          transactionData,
                          //HACK: how does index-1 solves this issue i have not idea
                          [`createdCells`, index - 1, "id"],
                          "temp-id",
                        ),
                      };
                    }
                    return acc;
                  },
                  {} as Record<string, CellData>,
                ),
              }
            : row;
        });
        console.log({ updatedRows });
        return updatedRows;
      });

      // Optionally refetch table data to ensure consistency
      await utils.table.invalidate();
    },
    onError: (error, variables, context) => {
      // Rollback on failure
      const { tempRowId } = context;
      setData((prev) => prev.filter((row) => row.id !== tempRowId));
      alert("Row creation failed");
    },
  });

  async function addNewRow() {
    addRowMutation.mutate({ tableId });
  }

  return (
    <div
      onClick={addNewRow}
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
