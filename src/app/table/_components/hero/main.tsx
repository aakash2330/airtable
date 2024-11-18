import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { TableSidebar } from "../sidebar/main";

export function ResizableDemo({ children }: { children: React.ReactNode }) {
  return (
    <ResizablePanelGroup direction="horizontal" className="h-full w-full">
      <ResizablePanel defaultSize={23} className="h-full">
        <TableSidebar></TableSidebar>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel className="h-full" defaultSize={77}>
        <div className="flex h-full w-full border-t-[1px]">{children}</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
