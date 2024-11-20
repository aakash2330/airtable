"use client";

import { Button } from "@/components/ui/button";
import { startTransition, useOptimistic } from "react";

export default function Page() {
  const [optimisticJob, addOptimisticJob] = useOptimistic(
    [1, 2, 3],
    (state, newItem: number) => {
      return [...state, newItem];
    },
  );

  function runJob() {
    startTransition(() => {
      addOptimisticJob(4);
    });
  }
  return (
    <div>
      <div>{[optimisticJob]}</div>
      <Button
        onClick={() => {
          runJob();
        }}
      >
        add
      </Button>
    </div>
  );
}
