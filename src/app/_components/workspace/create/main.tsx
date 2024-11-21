"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { useState } from "react";

//TODO: change all alerts to toast

export function CreateWorksheet() {
  const [inputText, setInputText] = useState("");
  const utils = api.useUtils();

  const createWorkspaceMutation = api.workspace.createWorkspace.useMutation({
    onSuccess: async ({ data: { success } }) => {
      if (!success) {
        alert("workspace creation failed");
      }
      alert("workspace created");
      await utils.workspace.invalidate();
    },
    onError: () => {
      alert("workspace creation failed");
    },
  });
  return (
    //FIX: Turn it into a form instead , fine for v1
    <div>
      Create Workspace :
      <Input
        placeholder="workspace123"
        onChange={(e) => {
          setInputText(e.target.value);
        }}
      ></Input>
      <Button
        onClick={async () => {
          if (inputText.length >= 1) {
            //create workspace
            createWorkspaceMutation.mutate({ workspaceName: inputText });
          } else {
            alert("please give workspace a name");
          }
        }}
      >
        Create Workspace
      </Button>
    </div>
  );
}
