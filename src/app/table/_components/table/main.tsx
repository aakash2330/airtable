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
import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  Maximize2,
  Plus,
} from "lucide-react";

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
        className="bg-transparent focus-visible:outline-none"
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
  const [hoveredRowIndex, setHoveredRowIndex] = React.useState<number | null>(
    null,
  );

  const columns = React.useMemo<Array<ColumnDef<BaseTableData>>>(
    () => [
      {
        accessorKey: "task",
        header: () => (
          <div className="flex w-full items-center justify-between gap-2 text-[#616670]">
            <div className="flex items-center justify-center gap-2">
              <p className="font-thin">A</p>
              <p className="font-light text-[#1d1f25]">Task</p>
            </div>
            <ChevronDown size={16} strokeWidth={1}></ChevronDown>
          </div>
        ),

        size: 200,
      },

      {
        accessorKey: "count",
        header: () => (
          <div className="flex w-full items-center justify-between gap-2 text-[#616670]">
            <div className="flex items-center justify-center gap-2">
              <p className="text-[20px] font-thin">⌗</p>
              <p className="font-light text-[#1d1f25]">Number</p>
            </div>
            <ChevronDown size={16} strokeWidth={1}></ChevronDown>
          </div>
        ),
        size: 200,
      },
    ],
    [],
  );

  const [data, setData] = React.useState(tableData);

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
    estimateSize: () => 5,
    overscan: 20,
  });

  return (
    <div ref={parentRef} className="container bg-neutral-100">
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        <table>
          <thead className="bg-[#f5f5f5]" style={{ height: "32px" }}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                <th className="px-3.5 text-left">
                  <Checkbox className="size-[11px] rounded-[2px] border-neutral-400 shadow-none" />
                </th>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      className="border-r-[1px] px-2 py-0 text-left text-[13px] text-[#1d1f25]"
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder ? null : (
                        <div>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </div>
                      )}
                    </th>
                  );
                })}
                <th className="border-b-[1px]">
                  <div className="flex w-full min-w-20 items-center justify-center">
                    <Plus size={18} strokeWidth={1}></Plus>
                  </div>
                </th>
                <th className="w-full border-b-[1px] bg-white"></th>
              </tr>
            ))}
          </thead>
          <tbody className="bg-white">
            {virtualizer.getVirtualItems().map((virtualRow, index) => {
              const row = rows[virtualRow.index];
              return (
                <tr
                  onMouseOver={() => {
                    setHoveredRowIndex(index);
                  }}
                  onMouseLeave={() => {
                    setHoveredRowIndex(null);
                  }}
                  className="hover:bg-neutral-100"
                  key={row?.id}
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${
                      virtualRow.start - index * virtualRow.size
                    }px)`,
                  }}
                >
                  <td className="min-w-20 border-y-[1px] pr-3">
                    <div className="flex items-center justify-center">
                      <div>
                        {hoveredRowIndex == index ? (
                          <GripVertical className="h-5 w-4 -translate-x-1 opacity-20 hover:cursor-grab"></GripVertical>
                        ) : (
                          <GripVertical className="invisible h-5 w-4 -translate-x-1 opacity-20"></GripVertical>
                        )}
                      </div>
                      <div className="flex-grow text-[12px] text-neutral-500">
                        {hoveredRowIndex == index ? (
                          <Checkbox className="size-[11px] rounded-[2px] border-neutral-400 shadow-none" />
                        ) : (
                          index + 1
                        )}
                      </div>

                      {hoveredRowIndex == index ? (
                        <Maximize2
                          color="#176ee1"
                          className="size-5 rounded-full p-1 hover:cursor-pointer hover:bg-[#C4ECFFB3]"
                          size={12}
                        ></Maximize2>
                      ) : (
                        <></>
                      )}
                    </div>
                  </td>
                  {row?.getVisibleCells().map((cell) => {
                    return (
                      <td
                        key={cell.id}
                        className={`bg-tranparent border-y-[1px] border-r-[1px] p-1.5 text-[13px]`}
                      >
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
            <tr className="h-8 hover:cursor-pointer hover:bg-neutral-100">
              <td className="border-b-[1px]">
                <div className="pl-1">
                  <Plus size={18} strokeWidth={1}></Plus>
                </div>
              </td>
              {new Array(columns.length).fill(null).map((item, index) => {
                return (
                  <td
                    className={`border-y-[1px] ${index == columns.length - 1 ? "border-r-[1px]" : ""}`}
                    key={index}
                  ></td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
