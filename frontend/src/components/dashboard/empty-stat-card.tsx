import { Plus } from "lucide-react"

interface EmptyStatCardProps {
  onClick?: () => void
}

export default function EmptyStatCard({ onClick }: EmptyStatCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex h-[15vh] flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-muted-foreground/30 p-4 text-muted-foreground transition-colors hover:border-muted-foreground/50 hover:bg-accent/50"
    >
      <Plus />
      <span className="text-xs font-medium">Add slot</span>
    </button>
  )
}
