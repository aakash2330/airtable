"use client";

import React, { useEffect, useState } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type OnChangeFn,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";

import { type CellData } from "@/validators/table";
import { api } from "@/trpc/react";
import { transformTableData } from "./helper/transformTableData";
import { Checkbox } from "@/components/ui/checkbox";
import { AddColumn } from "./column/add";
import { AddRowsBulk } from "./bulk/rows";
import { AddRow } from "./row/add";

const fetchSize = 50;

const defaultColumn: Partial<ColumnDef<Record<string, CellData>>> = {
  cell: ({ getValue, cell, table }) => {
    const cellData = getValue() as { value: string; cellId: string };
    const initialValue = cellData ? cellData.value : "";

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

export function ReactTableVirtualizedInfinite({
  tableId,
  totalDBRowCount,
  tableData,
  columnsData,
}: {
  tableData: Record<string, CellData>[];
  columnsData: Array<ColumnDef<Record<string, CellData>>>;
  totalDBRowCount: number;
  tableId: string;
}) {
  //we need a reference to the scrolling element for logic down below
  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const [queuedCellUpdates, setQueuedCellUpdates] = React.useState<
    Array<{ cellId: string; value: string }>
  >([]);
  const [hoveredRowIndex, setHoveredRowIndex] = React.useState<number | null>();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columns, setColumns] = React.useState([
    {
      accessorKey: "index",
      header: () => {
        return (
          <Checkbox className="size-[11px] rounded-[2px] border-neutral-400 shadow-none" />
        );
      },

      cell: (cell) => {
        return <div>{+cell.row.id + 1}</div>;
      },
      size: 50,
    },
    ...columnsData,
    {
      accessorKey: "addColumn",
      header: () => {
        return (
          <AddColumn
            setData={setFlatData}
            tableId={tableId}
            columns={columns}
            setColumns={setColumns}
          ></AddColumn>
        );
      },

      cell: (cell) => {
        return <></>;
      },
      size: 200,
    },
  ]);

  const getTableDataMutation = api.table.getTableData.useMutation();

  //react-query has a useInfiniteQuery hook that is perfect for this use case
  const { data, fetchNextPage, isFetching, isLoading } = useInfiniteQuery<
    Record<string, CellData>[]
  >({
    queryKey: [],
    queryFn: async ({ pageParam = 0 }) => {
      const start = (pageParam as number) * fetchSize;
      const fetchedData = await getTableDataMutation.mutateAsync({
        start,
        size: fetchSize,
        tableId,
      });
      const transformedData = transformTableData(fetchedData.tableData);
      return transformedData;
    },
    initialPageParam: 0,
    initialData: {
      pages: [tableData],
      pageParams: [0],
    },
    getNextPageParam: (_lastGroup, groups) => groups.length,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  //flatten the array of arrays from the useInfiniteQuery hook
  const [flatData, setFlatData] = useState<Record<string, CellData>[]>([]);

  useEffect(() => {
    setFlatData(data?.pages?.flat() ?? []);
  }, [data]);
  const totalFetched = flatData.length;

  //called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
  const fetchMoreOnBottomReached = React.useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        //once the user has scrolled within 500px of the bottom of the table, fetch more data if we can
        if (
          scrollHeight - scrollTop - clientHeight < 500 &&
          !isFetching &&
          totalFetched < totalDBRowCount
        ) {
          // eslint-disable-next-line
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount],
  );

  const updateCellMutation = api.table.updateCell.useMutation();

  const updateData = (rowIndex: number, columnId: string, value: unknown) => {
    const rowData = flatData[rowIndex];

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

    if (cellId.startsWith("temp-")) {
      setQueuedCellUpdates((prev) => [
        ...prev,
        { cellId, value: value as string },
      ]);
    } else {
      updateCellMutation.mutate({ cellId, value: value as string });
    }
  };

  React.useEffect(() => {
    console.log("asdasdasd");
    if (queuedCellUpdates.length === 0) return;
    console.log("mutating queued");

    const updatesToProcess = queuedCellUpdates.filter(
      (update) => !update.cellId.startsWith("temp-"),
    );

    updatesToProcess.forEach((update) => {
      updateCellMutation.mutate({ cellId: update.cellId, value: update.value });
    });

    setQueuedCellUpdates((prev) =>
      prev.filter((update) => update.cellId.startsWith("temp-")),
    );
  }, [data]);

  //a check on mount and after a fetch to see if the table is already scrolled to the bottom and immediately needs to fetch more data
  React.useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  const table = useReactTable({
    data: flatData,
    columns,
    defaultColumn,
    state: {
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    debugTable: true,
    meta: {
      updateData,
    },
  });

  //scroll to top of table when sorting changes
  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    setSorting(updater);
    if (!!table.getRowModel().rows.length) {
      rowVirtualizer.scrollToIndex?.(0);
    }
  };

  //since this table option is derived from table row model state, we're using the table.setOptions utility
  table.setOptions((prev) => ({
    ...prev,
    onSortingChange: handleSortingChange,
  }));

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 33, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== "undefined" && !navigator.userAgent.includes("Firefox")
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <div>
      <div className="flex text-xs">
        ({flatData.length} of {totalDBRowCount} rows fetched)
        <AddRowsBulk tableId={tableId}></AddRowsBulk>
      </div>
      <div
        className="no-scrollbar container"
        onScroll={(e) => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
        ref={tableContainerRef}
        style={{
          overflow: "auto",
          position: "relative",
          height: "600px",
        }}
      >
        <table style={{ display: "grid" }}>
          <thead
            className="flex bg-[#f5f5f5]"
            style={{
              position: "sticky",
              zIndex: 1,
            }}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                style={{ display: "flex", width: "100%" }}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      className="flex items-center justify-start border-r-[1px] px-2 py-0 text-left text-[13px] font-normal text-[#1d1f25]"
                      key={header.id}
                      style={{
                        display: "flex",
                        width: header.getSize(),
                      }}
                    >
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
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody
            style={{
              display: "grid",
              height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
              position: "relative", //needed for absolute positioning of rows
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow, index) => {
              const row = rows[virtualRow.index]!;
              return (
                <tr
                  onMouseOver={() => {
                    setHoveredRowIndex(index);
                  }}
                  onMouseLeave={() => {
                    setHoveredRowIndex(null);
                  }}
                  data-index={virtualRow.index} //needed for dynamic row height measurement
                  ref={(node) => rowVirtualizer.measureElement(node)} //measure dynamic row height
                  key={row.id}
                  style={{
                    display: "flex",
                    position: "absolute",
                    transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                    width: "100%",
                    backgroundColor: hoveredRowIndex == index ? "#f5f5f5" : "",
                  }}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td
                        key={cell.id}
                        style={{
                          display: "flex",
                          width: cell.column.getSize(),
                        }}
                        className={`bg-tranparent ${cell.column.id == "addColumn" ? "" : "border-y-[1px] border-r-[1px]"} ${cell.column.id == "index" ? "border-r-0" : ""} p-1.5 text-[13px]`}
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

            <tr
              className="hover:cursor-pointer hover:bg-[#f5f5f5]"
              style={{
                display: "flex",
                position: "absolute",
                transform: `translateY(${rowVirtualizer.getTotalSize()}px)`,
                width: "100%",
              }}
            >
              <td
                colSpan={columns.length}
                style={{
                  textAlign: "center",
                }}
              >
                <AddRow
                  columns={columns}
                  setData={setFlatData}
                  tableId={tableId}
                ></AddRow>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {isFetching && <div className="text-xs">Fetching Data ...</div>}
    </div>
  );
}
