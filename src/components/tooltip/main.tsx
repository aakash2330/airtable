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
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        className={cn("flex items-center justify-center", item.className)}
      >
        {item.title}
      </TooltipTrigger>
      <TooltipContent>{item.content}</TooltipContent>
    </Tooltip>
  );
}
