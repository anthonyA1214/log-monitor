import { Plus } from "lucide-react";

export default function EmptyStatCard() {
  return (
    <button
      className="flex h-[15vh] flex-col gap-1.5 items-center justify-center rounded-lg border border-dashed border-muted-foreground/30 text-muted-foreground transition-colors hover:border-muted-foreground/50 hover:bg-accent/50 p-4"
    >
      <Plus />
      <span className="text-xs font-medium">Add slot</span>
    </button>
  )
}
