"use client";

import * as React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { type BaseTableData } from "./mock-table-data";
import { Checkbox } from "@/components/ui/checkbox";

const defaultColumn: Partial<ColumnDef<BaseTableData>> = {
  cell: ({ getValue, row: { index }, column: { id }, table }) => {
    const initialValue = getValue();
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue);

    // When the input is blurred, we'll call our table meta's updateData function
    const onBlur = () => {
      table.options.meta?.updateData(index, id, value);
    };

    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return (
      <input
        value={value as string}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
      />
    );
  },
};

export function ReactTableVirtualized({
  tableData,
}: {
  tableData: BaseTableData[];
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns = React.useMemo<Array<ColumnDef<BaseTableData>>>(
    () => [
      {
        accessorKey: "id",
        header: () => <Checkbox />,
        cell: (info) => {
          return info.row.index + 1;
        },
      },
      {
        accessorKey: "task",
        header: () => "task",
        size: 80,
      },

      {
        accessorKey: "hello",
        header: () => "hello",
        size: 80,
      },
    ],
    [],
  );

  const [data, setData] = React.useState(tableData);

  console.log({ data });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    defaultColumn,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  });

  const { rows } = table.getRowModel();

  const parentRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 34,
    overscan: 20,
  });

  return (
    <div ref={parentRef} className="container">
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      className="border-[1px] bg-neutral-100 text-left"
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {{
                            asc: " 🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {virtualizer.getVirtualItems().map((virtualRow, index) => {
              const row = rows[virtualRow.index];
              return (
                <tr
                  className="border-[1px]"
                  key={row?.id}
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${
                      virtualRow.start - index * virtualRow.size
                    }px)`,
                  }}
                >
                  {row?.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id} className="border-[1px]">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
