
import { Suspense } from "react";
import { TableNavMain } from "../_components/nav/main";
import { SheetSelectorSection } from "../_components/sheet-selector/main";
import { OptionsMenu } from "../_components/options-menu/main";
import { ResizableDemo } from "../_components/hero/main";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-screen flex-col">
      <TableNavMain />
      <Suspense>
        <SheetSelectorSection />
      </Suspense>
      <OptionsMenu />
      <div className="flex-1">
        <ResizableDemo>
          <Suspense fallback={<p>Loading feed...</p>}>{children}</Suspense>
        </ResizableDemo>
      </div>
    </div>
  );
}
