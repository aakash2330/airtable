import { clearCache } from "@/app/actions/clear-cache";
import { api } from "@/trpc/react";
import _ from "lodash";
import { Plus } from "lucide-react";

export function AddRowsBulk({ tableId }: { tableId: string }) {
  const utils = api.useUtils();
  const addRowMutation = api.table.addBulkRows.useMutation({
    onSuccess: async ({ data: { transactionData } }) => {
      if (!transactionData) {
        alert("Row creation failed");
      }

      await utils.table.invalidate();
      await clearCache();
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
      <div className="border-b-[1px]">
        <div className="flex pl-1">
          <Plus size={18} strokeWidth={1}></Plus>
          add bulk
        </div>
      </div>
    </div>
  );
}
