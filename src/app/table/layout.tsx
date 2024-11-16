import { TableNavMain } from "./_components/nav/main";
import { SheetSelectorSection } from "./_components/sheet-selector/main";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <TableNavMain></TableNavMain>
      <SheetSelectorSection></SheetSelectorSection>
      {children}
    </div>
  );
}
