import { Badge } from "@/components/ui/badge";
import { Check, Plus } from "lucide-react";

export function TableSidebarCreateItem({
  item,
}: {
  item: {
    // eslint-disable-next-line
    icon?: any;
    title: string;
    pill: boolean;
  };
}) {
  return (
    <div className="flex h-8 w-full items-center justify-between text-[13px]">
      <div className="flex flex-1 items-center gap-2">
        <div className="flex items-center justify-start gap-2">
          {item.icon}
          {item.title}
          {item.pill && (
            <div className="rounded-full bg-[#c4ecff] px-2 py-0 text-[11px] text-[#0f68a2] hover:bg-[#c4ecff]">
              Team
            </div>
          )}
        </div>
      </div>
      <Plus size={16} strokeWidth={1}></Plus>
    </div>
  );
}

export function TableSidebarViewSelection({
  item,
}: {
  item: {
    // eslint-disable-next-line
    icon?: any;
    title: string;
    pill: boolean;
  };
}) {
  return (
    <div className="flex h-8 w-full items-center bg-[#C4ECFFB3] p-2 text-sm">
      <div className="flex flex-1 items-center gap-2">
        {item.icon}
        {item.title}
      </div>
      <Check size={16} strokeWidth={1}></Check>
    </div>
  );
}
