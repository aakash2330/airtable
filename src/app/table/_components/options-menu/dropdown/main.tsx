import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function OptionsMenuDropdown({
  title,
  content,
}: {
  title: JSX.Element;
  content: JSX.Element;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-7 items-center justify-center gap-1 rounded-sm px-2 text-[13px] font-light hover:bg-[#0000000D]">
        {title}
      </DropdownMenuTrigger>
      <DropdownMenuContent>{content}</DropdownMenuContent>
    </DropdownMenu>
  );
}
