import { ToolTipMain } from "@/components/tooltip/main";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  ChevronDown,
  CircleHelp,
  Rocket,
  TimerReset,
  Users,
} from "lucide-react";
import Link from "next/link";

export const navMenuDataLeft = [
  {
    id: "left-nav-98",
    render: (
      <div className="flex items-center justify-center gap-3 text-neutral-100">
        <Rocket className="size-6" strokeWidth={1.5} />
        <div className="flex items-center justify-center gap-1 truncate text-[17px] font-strongest">
          {/*
          // TODO: give it fixed width and truncate the rest in case user addds a long ass title
          */}
          Untitled App
          <ChevronDown className="size-4 font-light" strokeWidth={1.5} />
        </div>
      </div>
    ),
  },

  {
    id: "left-nav-1",
    render: (
      <NavMenuItem>
        <Link href="/table/data">Data</Link>
      </NavMenuItem>
    ),
  },
  {
    id: "left-nav-2",
    render: (
      <NavMenuItem>
        <Link href="/table/automations">Automations</Link>
      </NavMenuItem>
    ),
  },
  {
    id: "left-nav-3",
    render: (
      <NavMenuItem>
        <Link href="/table/interfaces">Interfaces</Link>
      </NavMenuItem>
    ),
  },
  {
    id: "left-nav-4",
    render: (
      <Separator
        orientation="vertical"
        className="h-5 bg-neutral-200/15"
      ></Separator>
    ),
  },
  {
    id: "left-nav-5",
    render: (
      <NavMenuItem>
        <Link href="/table/forms">Forms</Link>
      </NavMenuItem>
    ),
  },
];

export const navMenuDataRight = [
  {
    id: "right-nav-1",
    render: (
      <ToolTipMain
        title={<TimerReset className="size-4" />}
        content={<p>Base History</p>}
        className={"rounded-full px-2 py-1 hover:bg-table-secondary"}
      ></ToolTipMain>
    ),
  },
  {
    id: "right-nav-2",
    render: (
      <NavMenuItem>
        <div className="flex items-center justify-center gap-2">
          <CircleHelp className="size-4" />
          <p>Help</p>
        </div>
      </NavMenuItem>
    ),
  },
  {
    id: "right-nav-3",
    render: (
      <Button
        size="xs"
        className="flex items-center justify-center rounded-full bg-neutral-100 hover:bg-white"
      >
        <Users color="#c50935"></Users>
        <p className="text-table-primary">Share</p>
      </Button>
    ),
  },
  {
    id: "right-nav-4",
    render: (
      <ToolTipMain
        title={
          <div className="flex items-center justify-center rounded-full bg-neutral-100 p-1 hover:bg-white">
            <Bell size={18} color="#c50935"></Bell>
          </div>
        }
        content={<p>Notifications</p>}
      ></ToolTipMain>
    ),
  },

  {
    id: "right-nav-5",
    render: (
      <ToolTipMain
        title={<p>A</p>}
        content={<p>A</p>}
        className={
          "flex items-center justify-center rounded-full bg-teal-300 px-2.5 py-1 text-black ring-1 ring-white"
        }
      ></ToolTipMain>
    ),
  },
];

export function NavMenuItem({ children }: { children: JSX.Element }) {
  return (
    <div className="flex items-center justify-center rounded-full px-3 py-1 hover:cursor-pointer hover:bg-table-secondary">
      {children}
    </div>
  );
}
