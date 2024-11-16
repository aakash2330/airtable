"use client";

import { navMenuDataLeft, navMenuDataRight } from "../../data/nav-data";
import { TooltipProvider } from "@/components/ui/tooltip";

export function TableNavMain() {
  return (
    <TooltipProvider>
      <nav className="flex h-[56px] items-center justify-between bg-table-primary p-5 text-neutral-100">
        <div className="flex items-center justify-center gap-3 text-neutral-100">
          {navMenuDataLeft.map((value) => {
            return <NavItem key={value.id} item={value}></NavItem>;
          })}
        </div>
        <div className="flex items-center justify-center gap-4 text-neutral-200">
          {navMenuDataRight.map((value) => {
            return <NavItem key={value.id} item={value}></NavItem>;
          })}
        </div>
      </nav>
    </TooltipProvider>
  );
}

function NavItem({ item }: { item: { render: JSX.Element } }) {
  return (
    <div>
      <div className="rounded-full text-[13px] font-light hover:text-neutral-200">
        {item.render}
      </div>
    </div>
  );
}
