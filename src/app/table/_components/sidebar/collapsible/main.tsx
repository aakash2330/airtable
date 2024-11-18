"use client";

import * as React from "react";
import {
  Calendar1,
  ChartBarBig,
  ChartBarStacked,
  ChartNetwork,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  KeyboardMusic,
  LayoutGrid,
  Table,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { TableSidebarCreateItem } from "../sidebarButtons/main";

const createItemListCollapsible = [
  {
    icon: <Table color="#176ee1" size={16} strokeWidth={1.3}></Table>,
    title: "Grid",
    pill: false,
  },

  {
    icon: <Calendar1 color="#d54402" size={16} strokeWidth={1.3}></Calendar1>,
    title: "Calendar",
    pill: false,
  },

  {
    icon: <LayoutGrid color="#7c37ef" size={16} strokeWidth={1.3}></LayoutGrid>,
    title: "Gallery",
    pill: false,
  },

  {
    icon: (
      <ChartBarBig color="#068a0d" size={16} strokeWidth={1.3}></ChartBarBig>
    ),
    title: "Kanban",
    pill: false,
  },
  {
    icon: (
      <ClipboardList
        color="#d54402"
        size={16}
        strokeWidth={1.3}
      ></ClipboardList>
    ),
    title: "Timeline",
    pill: true,
  },

  {
    icon: (
      <ChartBarStacked
        color="#176ee1"
        size={16}
        strokeWidth={1.3}
      ></ChartBarStacked>
    ),
    title: "List",
    pill: false,
  },

  {
    icon: (
      <ChartNetwork color="#068a0d" size={16} strokeWidth={1.3}></ChartNetwork>
    ),
    title: "Gantt",
    pill: true,
  },

  {
    icon: <></>,
    title: "New Section",
    pill: true,
  },
];

export function TableSidebarCollapsible() {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full space-y-2"
    >
      <Separator></Separator>
      <div className="flex items-center justify-between space-x-4 pl-4 pr-2">
        <h4 className="text-sm font-semibold">Create...</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="flex flex-col items-center justify-center gap-3 px-4">
        <div className="w-full">
          {createItemListCollapsible.map((item, index) => {
            return (
              <TableSidebarCreateItem
                key={index}
                item={item}
              ></TableSidebarCreateItem>
            );
          })}
        </div>
        <Separator></Separator>
        <TableSidebarCreateItem
          item={{
            icon: (
              <KeyboardMusic
                color="#dd04a8"
                size={16}
                strokeWidth={1.3}
              ></KeyboardMusic>
            ),
            title: "Form",
            pill: false,
          }}
        ></TableSidebarCreateItem>
      </CollapsibleContent>
    </Collapsible>
  );
}
