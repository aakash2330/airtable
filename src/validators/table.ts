import { type Prisma } from "@prisma/client";

export type TtableWithRowsAndColumns = Prisma.TableGetPayload<{
  include: {
    rows: { include: { cells: true } };
    columns: true;
  };
}>;


export type CellData = {
  value: string;
  cellId: string;
};
