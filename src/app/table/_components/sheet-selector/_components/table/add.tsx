"use client";

import { Plus } from "lucide-react";
import { OptionsMenuDropdown } from "../../../options-menu/dropdown/main";

import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useState } from "react";

export function AddTableDropdown({
  workspaceId,
}: {
  workspaceId: string | null;
}) {
  const [tableNameInput, setTableNameInput] = useState("");
  const utils = api.useUtils();
  const createTableMutation = api.table.addNewTableToWorkspace.useMutation({
    onSuccess: async ({ data: { success } }) => {
      if (!success) {
        alert("Table creation failed");
      }
      alert("table created");
      await utils.workspace.invalidate();
    },
    onError: () => {
      alert("table creation failed");
    },
  });
  return (
    //TODO: should be form with validations + toast
    <OptionsMenuDropdown
      title={<Plus className="size-4 font-light" strokeWidth={1.5} />}
      content={
        <>
          <DropdownMenuLabel>Create Table</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Input
            placeholder="table123"
            onChange={(e) => {
              setTableNameInput(e.target.value);
            }}
          ></Input>
          <DropdownMenuItem>
            <Button
              onClick={() => {
                if (tableNameInput.length > 1 && workspaceId) {
                  createTableMutation.mutate({
                    tableName: tableNameInput,
                    workspaceId,
                  });
                } else {
                  alert("table name length should be > 1");
                }
              }}
            >
              Create
            </Button>
          </DropdownMenuItem>
        </>
      }
    ></OptionsMenuDropdown>
  );
}
