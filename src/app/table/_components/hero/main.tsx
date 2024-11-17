import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export function ResizableDemo({ children }: { children: React.ReactNode }) {
  return (
    <ResizablePanelGroup direction="horizontal" className="h-full w-full">
      <ResizablePanel defaultSize={25} className="h-full">
        <div className="flex h-full items-center justify-center border-t-[1px] p-6">
          <div className="flex flex-col justify-center items-center p-3">
<div>item</div>
<div>item</div>
<div>item</div>
<div>item</div>
<div>item</div>
<div>item</div>
<div>item</div>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={75}>
        <div className="flex h-full items-center justify-center overflow-scroll border-t-[1px] p-6">
          {children}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
