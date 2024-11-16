import { ReactTableVirtualized } from "./_components/table/main";
import { makeData } from "./_components/table/mock-table-data";

export default function Page() {
  const data = makeData(100);
  return <ReactTableVirtualized tableData={data}></ReactTableVirtualized>;
}
