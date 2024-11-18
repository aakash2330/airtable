import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function ToolTipMain(item: {
  content: JSX.Element;
  title: JSX.Element;
  className?: string;
  side?: "bottom" | "right" | "left" | "top";
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        className={cn("flex items-center justify-center", item.className)}
      >
        {item.title}
      </TooltipTrigger>
      <TooltipContent side={item.side ? item.side : "bottom"}>
        {item.content}
      </TooltipContent>
    </Tooltip>
  );
}
