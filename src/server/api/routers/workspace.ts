import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const workspaceRouter = createTRPCRouter({
  getWorksheetDataById: protectedProcedure
    .input(z.object({ workspaceId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const workspace = await ctx.db.workspace.findFirst({
        where: { id: input.workspaceId },
        //include: { tables: { select: { name: true } } },
      });

      if (!workspace) {
        throw new Error(
          `Unable to find workspace with Id ${input.workspaceId}`,
        );
      }
      return { data: workspace };
    }),

  getWorksheetTablesById: protectedProcedure
    .input(z.object({ workspaceId: z.string().min(1).nullable() }))
    .query(async ({ ctx, input }) => {
      if (!input.workspaceId) {
        return null;
      }
      const workspaceTables = await ctx.db.workspace.findFirst({
        where: { id: input.workspaceId },
        select: { tables: { select: { id: true, name: true } } },
      });

      if (!workspaceTables) {
        throw new Error(
          `Unable to find workspace with Id ${input.workspaceId}`,
        );
      }
      return { data: workspaceTables };
    }),

  getAllWorkspacesList: protectedProcedure.query(async ({ ctx }) => {
    const workspacesList = await ctx.db.workspace.findMany({
      where: { userId: ctx.session.user.id },
      include: { tables: { take: 1, select: { id: true } } },
    });

    return workspacesList ?? null;
  }),

  createWorkspace: protectedProcedure
    .input(z.object({ workspaceName: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const createdWorkspace = await ctx.db.workspace.create({
        data: {
          name: input.workspaceName,
          userId: ctx.session.user.id,
        },
      });
      if (!createdWorkspace) {
        throw new Error("Workspace Creation Error");
      }
      return { data: { success: true } };
    }),
});
