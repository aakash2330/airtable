import { Suspense } from "react";
import TablePage from "../_components/table/table-page";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    //TODO:parse the query-params here
    <Suspense fallback={<p>Loading Table...</p>}>
      <TablePage searchParams={searchParams}></TablePage>
    </Suspense>
  );
}
