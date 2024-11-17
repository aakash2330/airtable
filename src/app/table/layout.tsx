import { Suspense } from "react";
import { TableNavMain } from "./_components/nav/main";
import { SheetSelectorSection } from "./_components/sheet-selector/main";
import { OptionsMenu } from "./_components/options-menu/main";
import { ResizableDemo } from "./_components/hero/main";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <TableNavMain></TableNavMain>
      <Suspense>
        <SheetSelectorSection></SheetSelectorSection>
      </Suspense>
      <OptionsMenu></OptionsMenu>
      <ResizableDemo>{children}</ResizableDemo>
    </div>
  );
}
