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
        start: z.number(),
        size: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tableData = await ctx.db.table.findFirst({
        where: { id: input.tableId },
        include: {
          rows: {
            include: { cells: true },
            skip: input.start,
            take: input.size,
          },
          columns: true,
        },
      });

      if (!tableData) {
        throw new Error(`Could not find table with id ${input.tableId}`);
      }

      const totalDBRowCount = await ctx.db.row.count({
        where: { tableId: input.tableId },
      });

      return {
        tableData,
        totalDBRowCount,
      };
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
      const transactionData = await ctx.db.$transaction(async (prisma) => {
        // Create the new column
        const createdColumn = await prisma.column.create({
          data: {
            tableId: input.tableId,
            name: input.columnName,
            position: input.position,
            dataType: input.dataType,
          },
        });

        if (!createdColumn) {
          throw new Error(`Couldn't add column`);
        }

        //create cells for rows
        const rows = await prisma.row.findMany({
          where: { tableId: input.tableId },
          select: { id: true },
        });
        if (rows.length > 0) {
          const cellsData = rows.map((row) => ({
            rowId: row.id,
            columnId: createdColumn.id,
            value: "",
          }));

          const createdCells = await prisma.cell.createManyAndReturn({
            data: cellsData,
          });
          return { createdColumn, createdCells };
        }
        return { createdColumn };
      });

      return { data: { transactionData } };
    }),

  addRowToTable: protectedProcedure
    .input(
      z.object({
        tableId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const transactionData = await ctx.db.$transaction(async (prisma) => {
        const createdRow = await prisma.row.create({
          data: {
            tableId: input.tableId,
          },
        });

        if (!createdRow) {
          throw new Error(`Couldn't add row`);
        }

        const columns = await prisma.column.findMany({
          where: { tableId: input.tableId },
          select: { id: true },
        });

        //this should be asserted
        if (columns.length > 0) {
          const cellsData = columns.map((column) => ({
            rowId: createdRow.id,
            columnId: column.id,
            value: "",
          }));

          const createdCells = await prisma.cell.createManyAndReturn({
            data: cellsData,
          });
          return { createdRow, createdCells };
        }

        return { createdRow };
      });

      return { data: { transactionData } };
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

  addBulkRows: protectedProcedure
    .input(
      z.object({
        tableId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const transactionData = await ctx.db.$transaction(
        async (prisma) => {
          // Fetch the columns once, as they will be the same for all rows
          const columns = await prisma.column.findMany({
            where: { tableId: input.tableId },
            select: { id: true },
          });

          if (columns.length === 0) {
            throw new Error("No columns found for the given tableId");
          }

          const createdRows = [];

          for (let i = 0; i < 1000; i++) {
            // Create a row
            const createdRow = await prisma.row.create({
              data: {
                tableId: input.tableId,
              },
            });

            if (!createdRow) {
              throw new Error(`Couldn't add row`);
            }

            createdRows.push(createdRow);

            // Generate random values for cells
            const cellsData = columns.map((column) => ({
              rowId: createdRow.id,
              columnId: column.id,
              value: Math.random().toString(36).substring(2, 8), // Random string
            }));

            const batchCreatedCells = await prisma.cell.createMany({
              data: cellsData,
            });
          }

          return { createdRows };
        },
        { timeout: 10000 },
      );

      return { data: { transactionData } };
    }),
});
