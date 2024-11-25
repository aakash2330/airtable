import { api } from "@/trpc/server";
import { type Column } from "@prisma/client";
import { type TtableWithRowsAndColumns } from "@/validators/table";
import { ReactTableVirtualizedInfinite } from "./main1";
import { transformTableData } from "./helper/transformTableData";

//TODO:Add correct lodash checks here ( too many nested selectors)

export default async function TablePage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const seachParamsData = await searchParams;
  const tableId = seachParamsData?.sheet;

  //HACK: use zod for seachParams validation , wouldn't need this check
  if (typeof tableId == "string") {
    //fetch table data if there is tablename

    const data = await api.table.getTableData({
      tableId,
      start: 0,
      size: 50,
    });

    //NOTE: even though all of them can be done in a single-step (some heavy dsa) , but it's more readable/debuggable this way
    const extreactedColumns = extractColumns(data.tableData); // extracts colums from the TableData
    const columnsMetadata = extractColumnMetadata(extreactedColumns); // converts the extracted colums to shape that tanstack table expects
    const transformedTableData = transformTableData(data.tableData); //converts the extracted colums to shape that tanstack table expects

    return (
      <ReactTableVirtualizedInfinite
        initialRowCount={data.totalDBRowCount}
        tableId={tableId}
        //TODO:can there be a better approach for this ?
        columnsData={columnsMetadata}
        initialTableData={transformedTableData}
      ></ReactTableVirtualizedInfinite>
    );
  }
  return <div>Please create a table </div>;
}

//TODO: clean this file a little maybe , too many functions idk they'll only be used by this file ever , lets see
function extractColumns(tableData: TtableWithRowsAndColumns): Column[] {
  return tableData.columns.sort((a, b) => a.position - b.position); // Sort by position
}

function extractColumnMetadata(columns: Column[]) {
  return columns
    .sort((a, b) => a.position - b.position) // Sort by position
    .map((column) => ({
      accessorKey: column.name,
      header: column.name,
      size: 200,
    }));
}

//NOTE:use this if workspace data needed

//  const paramsData = await params;
//  console.log({ worksheetId: paramsData });
//  if (!paramsData.id) {
//    return <div>No workspace Id found</div>;
//  }
//  const workspace = await api.workspace.getWorksheetDataById({
//    workspaceId: paramsData.id,
//  });
//  if (!workspace.data) {
//    return <div>Couldnt fetch data for the given workspaceId</div>;
//  }
//

//NOTE:Use this mocked data to add new entries to tables
//const mockData = makeData(3);
