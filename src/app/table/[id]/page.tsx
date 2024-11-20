import { Suspense } from "react";
import TablePage from "../_components/table/table-page";

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    //TODO:parse the query-params here
    <Suspense
      key={JSON.stringify(await searchParams)}
      fallback={<p>Loading Table...</p>}
    >
      <TablePage searchParams={searchParams}></TablePage>
    </Suspense>
  );
}
