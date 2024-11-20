import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

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
    .mutation(async ({ ctx, input }) => {
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
});


