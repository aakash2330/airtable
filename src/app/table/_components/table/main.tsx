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
import { Checkbox } from "@/components/ui/checkbox";
import { GripVertical, Maximize2 } from "lucide-react";
import { AddColumn } from "./column/add";
import { AddRow } from "./row/add";
import { api } from "@/trpc/react";
import { type CellData } from "@/validators/table";
import { AddRowsBulk } from "./bulk/rows";

const defaultColumn: Partial<ColumnDef<Record<string, CellData>>> = {
  cell: ({ getValue, cell, table }) => {
    const cellData = getValue() as { value: string; cellId: string };
    const initialValue = cellData.value;

    // eslint-disable-next-line
    const [value, setValue] = React.useState(initialValue);

    const rowIndex = cell.row.index;
    const columnId = cell.column.id;

    const onBlur = () => {
      table.options.meta?.updateData(rowIndex, columnId, value);
    };

    // Sync state if initialValue changes
    // eslint-disable-next-line
    React.useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return (
      <input
        className="bg-transparent focus-visible:outline-none"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        onBlur={onBlur}
      />
    );
  },
};

export function ReactTableVirtualized({
  tableId,
  tableData,
  columnsData,
}: {
  tableData: Record<string, CellData>[];
  columnsData: Array<ColumnDef<Record<string, CellData>>>;
  tableId: string;
}) {
  const [columns, setColumns] = React.useState(columnsData);
  const [data, setData] = React.useState(tableData);
  //  const [queuedCellUpdates, setQueuedCellUpdates] = React.useState<
  //    Array<{ cellId: string; value: string }>
  //  >([]);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [hoveredRowIndex, setHoveredRowIndex] = React.useState<number | null>(
    null,
  );

  const updateCellMutation = api.table.updateCell.useMutation();

  const updateData = (rowIndex: number, columnId: string, value: unknown) => {
    const rowData = data[rowIndex];

    if (!rowData) {
      return;
    }

    const cellData = rowData[columnId];

    if (!cellData) {
      console.error(
        `Cell data is undefined for column '${columnId}' at row ${rowIndex}`,
      );
      return;
    }

    const cellId = cellData.cellId;

    setData((oldData) =>
      oldData.map((row, index) => {
        if (index !== rowIndex) return row;

        const updatedCellData: CellData = {
          cellId: cellData.cellId,
          value: value as string,
        };

        return {
          ...row,
          [columnId]: updatedCellData,
        };
      }),
    );

    if (cellId.startsWith("temp-")) {
      //      setQueuedCellUpdates((prev) => [
      //        ...prev,
      //        { cellId, value: value as string },
      //      ]);
    } else {
      updateCellMutation.mutate({ cellId, value: value as string });
    }
  };

  //  React.useEffect(() => {
  //    if (queuedCellUpdates.length === 0) return;
  //
  //    const updatesToProcess = queuedCellUpdates.filter(
  //      (update) => !update.cellId.startsWith("temp-"),
  //    );
  //
  //    updatesToProcess.forEach((update) => {
  //      updateCellMutation.mutate({ cellId: update.cellId, value: update.value });
  //    });
  //
  //    setQueuedCellUpdates((prev) =>
  //      prev.filter((update) => update.cellId.startsWith("temp-")),
  //    );
  //  }, [data]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    defaultColumn,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    getSortedRowModel: getSortedRowModel(),
    meta: {
      updateData,
    },
  });
  const { rows } = table.getRowModel();

  const parentRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 32,
    overscan: 20,
  });

  return (
    <div
      ref={parentRef}
      className="container h-[30rem] overflow-auto bg-neutral-100"
    >
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
                <th className="border-b-[1px] border-r-[1px] hover:cursor-pointer hover:bg-white">
                  <AddColumn
                    setData={setData}
                    tableId={tableId}
                    columns={columns}
                    setColumns={setColumns}
                  ></AddColumn>
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
                          +row!.id + 1
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
            <AddRow
              columns={columns}
              setData={setData}
              tableId={tableId}
            ></AddRow>
            <AddRowsBulk
              tableId={tableId}
            ></AddRowsBulk>
          </tbody>
        </table>
      </div>
    </div>
  );
}
