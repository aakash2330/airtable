import { Button } from "@/components/ui/button";
import { ChevronDown, Rocket } from "lucide-react";

export function TableNavMain() {
  return (
    <nav className="flex h-[56px] items-center justify-between bg-[#dc053c] p-5 text-white">
      <div className="flex items-center justify-center gap-5">
        <Rocket className="size-6" strokeWidth={1.5} />
        <div className="flex items-center justify-center gap-1 font-strongest">
          Untitled App{" "}
          <ChevronDown className="size-4 font-light" strokeWidth={1.5} />
        </div>
        {["Data", "Automations", "Interfaces", "Forms"].map((item, index) => {
          return (
            <div key={index} className="text-sm font-light">
              <Button>{item}</Button>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
