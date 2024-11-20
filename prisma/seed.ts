import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  async function a() {
    const userId = "cm3paxcd40000on9wzqslofq0"; // Replace this with the user ID

    // Step 1: Create a workspace
    const workspace = await prisma.workspace.create({
      data: {
        name: "Workspace 1",
        userId,
      },
    });
    console.log(`Created Workspace: ${workspace.id}`);

    // Step 2: Create a table in the workspace
    const table = await prisma.table.create({
      data: {
        name: "Table 1",
        workspaceId: workspace.id,
        columns: {
          create: [
            { name: "Column1", dataType: "string", position: 1 },
            { name: "Column2", dataType: "number", position: 2 },
          ],
        },
      },
      include: { columns: true },
    });
    console.log(`Created Table: ${table.id}`);

    // Get the created column IDs
    const [column1, column2] = table.columns;

    console.log({ column1, column2 });

    // Step 3: Create rows and cells using the column IDs

    if (column1 && column2) {
      const row1 = await prisma.row.create({
        data: {
          tableId: table.id,
          cells: {
            create: [
              { value: "Row 1, Col 1", columnId: column1.id },
              { value: "123", columnId: column2.id },
            ],
          },
        },
      });

      const row2 = await prisma.row.create({
        data: {
          tableId: table.id,
          cells: {
            create: [
              { value: "Row 2, Col 1", columnId: column1.id },
              { value: "456", columnId: column2.id },
            ],
          },
        },
      });

      console.log(`Created Rows: ${row1.id}, ${row2.id}`);
    }
  }

  async function b() {
    const userId = "cm3paxcd40000on9wzqslofq0"; // Replace this with the user ID

    // Step 1: Create a workspace
    const workspace = await prisma.workspace.create({
      data: {
        name: "Workspace 2",
        userId,
      },
    });
    console.log(`Created Workspace: ${workspace.id}`);

    // Step 2: Create a table in the workspace
    const table = await prisma.table.create({
      data: {
        name: "Table 2",
        workspaceId: workspace.id,
        columns: {
          create: [
            { name: "Column1", dataType: "string", position: 1 },
            { name: "Column2", dataType: "number", position: 2 },
          ],
        },
      },
      include: { columns: true },
    });
    console.log(`Created Table: ${table.id}`);

    // Get the created column IDs
    const [column1, column2] = table.columns;

    console.log({ column1, column2 });

    // Step 3: Create rows and cells using the column IDs

    if (column1 && column2) {
      const row1 = await prisma.row.create({
        data: {
          tableId: table.id,
          cells: {
            create: [
              { value: "Row 1, Col 1", columnId: column1.id },
              { value: "123", columnId: column2.id },
            ],
          },
        },
      });

      const row2 = await prisma.row.create({
        data: {
          tableId: table.id,
          cells: {
            create: [
              { value: "Row 2, Col 1", columnId: column1.id },
              { value: "456", columnId: column2.id },
            ],
          },
        },
      });

      console.log(`Created Rows: ${row1.id}, ${row2.id}`);
    }
  }
  await a();
  await b();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
