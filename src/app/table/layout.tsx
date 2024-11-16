import { TableNavMain } from "./_components/nav/main";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <TableNavMain></TableNavMain>
      {children}
    </div>
  );
}
