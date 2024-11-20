import { clearCache } from "@/app/actions/clear-cache";
import { api } from "@/trpc/react";
import { type CellData } from "@/validators/table";
import { type ColumnDef } from "@tanstack/react-table";
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
    onSuccess: async ({ data: { addedRow } }) => {
      if (!addedRow) {
        alert("column creation failed");
      }

      await clearCache();

      await utils.table.invalidate();
    },
    onError: () => {
      alert("Column creation failed");
    },
  });
  return (
    <tr
      onClick={() => {
        addRowMutation.mutate({ tableId });
      }}
      className="h-8 hover:cursor-pointer hover:bg-neutral-100"
    >
      <td className="border-b-[1px]">
        <div className="pl-1">
          <Plus size={18} strokeWidth={1}></Plus>
        </div>
      </td>
      {new Array(columns.length).fill(null).map((item, index) => {
        return (
          <td
            className={`border-y-[1px] ${index == columns.length - 1 ? "border-r-[1px]" : ""}`}
            key={index}
          ></td>
        );
      })}
    </tr>
  );
}
