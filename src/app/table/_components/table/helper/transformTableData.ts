import { type TtableWithRowsAndColumns } from "@/validators/table";

export function transformTableData(
  tableData: TtableWithRowsAndColumns,
): Record<string, any>[] {
  const { columns, rows } = tableData;

  const columnMap: Record<string, string> = columns.reduce(
    (acc, column) => {
      acc[column.id] = column.name;
      return acc;
    },
    {} as Record<string, string>,
  );

  const transformedRows = rows.map((row) => {
    const rowObject: Record<string, any> = {
      id: row.id, // Include row ID
    };

    row.cells.forEach((cell) => {
      const columnName = columnMap[cell.columnId];
      if (columnName) {
        rowObject[columnName] = {
          value: cell.value,
          cellId: cell.id,
        };
      }
    });

    return rowObject;
  });

  return transformedRows;
}
