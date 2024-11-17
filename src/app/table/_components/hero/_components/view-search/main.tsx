"use client";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search, Settings } from "lucide-react";
import { useState } from "react";

export function ViewSearchInput() {
  const [focused, setFocused] = useState(0);
  return (
    <div className="flex w-full flex-col">
      <div className="flex items-center justify-center">
        <Search strokeWidth={0.7} size={18}></Search>
        <Input
          onBlur={() => {
            setFocused(0);
          }}
          onFocus={() => {
            setFocused(1);
          }}
          className="w-full border-none shadow-none focus-visible:ring-0"
          placeholder="Find a view"
        ></Input>
        <Settings strokeWidth={1} size={18}></Settings>
      </div>
      <Separator
        className={`h-[1px] ${focused ? "bg-blue-700" : "bg-neutral-200"}`}
      ></Separator>
    </div>
  );
}
