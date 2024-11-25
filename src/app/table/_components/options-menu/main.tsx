"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { optionsMenuData } from "./options";
import { ToolTipMain } from "@/components/tooltip/main";
import { Command, Search, X } from "lucide-react";
import { OptionsMenuDropdown } from "./dropdown/main";
import { Input } from "@/components/ui/input";
import { useSearchInputStore } from "@/store/search";

export function OptionsMenu() {
  const changeSearchInput = useSearchInputStore(
    (state) => state.changeSearchInput,
  );
  console.log({ changeSearchInput });
  return (
    <TooltipProvider delayDuration={500}>
      <div className="flex h-10 items-center justify-between gap-3 p-2">
        <div className="flex items-center justify-between gap-3">
          {optionsMenuData.map((item) => {
            return (
              <div
                className="flex items-center justify-center gap-2"
                key={item.id}
              >
                {item.render}
              </div>
            );
          })}
        </div>

        <ToolTipMain
          side="left"
          title={
            <div className="flex items-center justify-center gap-1">
              <OptionsMenuDropdown
                title={<Search strokeWidth={1.3} size={16}></Search>}
                content={
                  <div className="flex items-center justify-center">
                    <Input
                      onChange={(e) => {
                        changeSearchInput(e.target.value);
                      }}
                      className="rounded-none border-none"
                    ></Input>
                    <X strokeWidth={1} size={18}></X>
                  </div>
                }
              ></OptionsMenuDropdown>
            </div>
          }
          content={
            <div className="flex w-[8rem] items-center justify-between gap-1">
              <p>Find in view</p>
              <div className="flex items-center justify-center gap-[2px]">
                <Command
                  className="rounded-sm bg-gray-500"
                  style={{ padding: "2px" }}
                  size={15}
                ></Command>
                <p className="rounded-sm bg-gray-500 px-1 py-0 text-[10px] font-bold">
                  F
                </p>
              </div>
            </div>
          }
          className="flex h-7 items-center justify-center gap-1 rounded-sm px-2 text-[13px] font-light hover:bg-[#0000000D]"
        ></ToolTipMain>
      </div>
    </TooltipProvider>
  );
}
