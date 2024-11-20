import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  ArrowUpDown,
  ChevronDown,
  ExternalLink,
  EyeOff,
  ListFilter,
  ListOrdered,
  Logs,
  PaintBucket,
  Search,
  Table,
  TableOfContents,
  Users,
} from "lucide-react";
import { OptionsMenuDropdown } from "./dropdown/main";
import { ToolTipMain } from "@/components/tooltip/main";

export const optionsMenuData = [
  {
    id: "option-menu-item-1",
    render: (
      <>
        <Button
          variant="ghost"
          className="h-7 rounded-sm bg-[#0000000D] px-2"
          size="sm"
        >
          <TableOfContents size={16}></TableOfContents>
          <p>Views</p>
        </Button>
        <Separator
          orientation="vertical"
          className="h-4 w-[1px] bg-neutral-300"
        ></Separator>
      </>
    ),
  },
  {
    id: "option-menu-item-2",
    render: (
      <Button
        variant="ghost"
        className="h-7 rounded-sm px-2 hover:bg-[#0000000D]"
        size="sm"
      >
        <Table color="#176ee1" size={16} strokeWidth={1.3}></Table>
        <p>Grid View</p>
        <Users size={16} strokeWidth={1.5}></Users>
        <ChevronDown></ChevronDown>
      </Button>
    ),
  },

  {
    id: "option-menu-item-3",
    render: (
      <Button
        variant="ghost"
        className="flex h-7 items-center justify-center gap-1 rounded-sm px-2 text-[13px] font-light hover:bg-[#0000000D]"
        size="sm"
      >
        <EyeOff size={16} strokeWidth={1.5}></EyeOff>
        <p>Hide fields</p>
      </Button>
    ),
  },

  {
    id: "option-menu-item-4",
    render: (
      <OptionsMenuDropdown
        title={
          <>
            <ListFilter size={14} strokeWidth={1.5}></ListFilter>
            Filter
          </>
        }
        content={
          <>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </>
        }
      ></OptionsMenuDropdown>
    ),
  },
  {
    id: "option-menu-item-5",
    render: (
      <Button
        variant="ghost"
        className="flex h-7 items-center justify-center gap-1 rounded-sm px-2 text-[13px] font-light hover:bg-[#0000000D]"
        size="sm"
      >
        <Logs size={16}></Logs>
        <p>Group</p>
      </Button>
    ),
  },
  {
    id: "option-menu-item-6",
    render: (
      <Button
        variant="ghost"
        className="flex h-7 items-center justify-center gap-1 rounded-sm px-2 text-[13px] font-light hover:bg-[#0000000D]"
        size="sm"
      >
        <ArrowUpDown size={14} strokeWidth={1}></ArrowUpDown>
        <p>Sort</p>
      </Button>
    ),
  },

  {
    id: "option-menu-item-7",
    render: (
      <Button
        variant="ghost"
        className="flex h-7 items-center justify-center gap-1 rounded-sm px-2 text-[13px] font-light hover:bg-[#0000000D]"
        size="sm"
      >
        <PaintBucket size={16} strokeWidth={1.5}></PaintBucket>
        <p>Color</p>
      </Button>
    ),
  },

  {
    id: "option-menu-item-8",
    render: (
      <ToolTipMain
        title={<ListOrdered className="size-4" />}
        content={<p>Row Height</p>}
        className="flex h-7 items-center justify-center gap-1 rounded-sm px-2 text-[13px] font-light hover:bg-[#0000000D]"
      ></ToolTipMain>
    ),
  },

  {
    id: "option-menu-item-9",
    render: (
      <ToolTipMain
        title={
          <div className="flex items-center justify-center gap-1">
            <ExternalLink strokeWidth={1} className="size-4" />
            <p>Share and sync</p>
          </div>
        }
        content={<p>Share view</p>}
        className="flex h-7 items-center justify-center gap-1 rounded-sm px-2 text-[13px] font-light hover:bg-[#0000000D]"
      ></ToolTipMain>
    ),
  },
];
