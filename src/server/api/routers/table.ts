import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

//NOTE: For the mutations , check whether the user is an owner or not , fine for now

export const tableRouter = createTRPCRouter({
  addNewTableToWorkspace: protectedProcedure
    .input(
      z.object({
        tableName: z.string().min(1),
        workspaceId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const createdTable = await ctx.db.table.create({
        data: {
          name: input.tableName,
          workspaceId: input.workspaceId,
        },
      });
      if (!createdTable) {
        throw new Error("Table Creation Error");
      }
      return { data: { success: true } };
    }),

  getTableData: protectedProcedure
    .input(
      z.object({
        tableId: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const tableData = await ctx.db.table.findFirst({
        where: { id: input.tableId },
        include: {
          rows: { include: { cells: true } },
          columns: true,
        },
      });
      if (!tableData) {
        throw new Error(`Could'nt find table with id ${input.tableId}`);
      }
      return { data: { tableData } };
    }),

  addColumnToTable: protectedProcedure
    .input(
      z.object({
        tableId: z.string().min(1),
        columnName: z.string().min(1),
        position: z.number(),
        dataType: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const addedColumn = await ctx.db.$transaction(async (prisma) => {
        // Create the new column
        const column = await prisma.column.create({
          data: {
            tableId: input.tableId,
            name: input.columnName,
            position: input.position,
            dataType: input.dataType,
          },
        });

        if (!column) {
          throw new Error(`Couldn't add column`);
        }

        const rows = await prisma.row.findMany({
          where: { tableId: input.tableId },
          select: { id: true },
        });

        if (rows.length > 0) {
          const cellsData = rows.map((row) => ({
            rowId: row.id,
            columnId: column.id,
            value: "",
          }));

          await prisma.cell.createMany({ data: cellsData });
        }

        return column;
      });

      return { data: { addedColumn } };
    }),

  addRowToTable: protectedProcedure
    .input(
      z.object({
        tableId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const addedRow = await ctx.db.$transaction(async (prisma) => {
        const row = await prisma.row.create({
          data: {
            tableId: input.tableId,
          },
        });

        if (!row) {
          throw new Error(`Couldn't add row`);
        }

        const columns = await prisma.column.findMany({
          where: { tableId: input.tableId },
          select: { id: true },
        });

        if (columns.length > 0) {
          const cellsData = columns.map((column) => ({
            rowId: row.id,
            columnId: column.id,
            value: "",
          }));

          await prisma.cell.createMany({ data: cellsData });
        }

        return row;
      });

      return { data: { addedRow } };
    }),

  updateCell: protectedProcedure
    .input(
      z.object({
        cellId: z.string().min(1),
        value: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.cell.update({
        where: { id: input.cellId },
        data: { value: input.value },
      });
    }),
});
