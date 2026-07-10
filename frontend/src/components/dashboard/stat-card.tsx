import { dashboardStatCardDotColorMap } from "@/lib/color-map"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Pencil } from "lucide-react"
import prettyBytes from "pretty-bytes"
import { Button } from "../ui/button"
import { useState } from "react"

interface StatCardProps {
  label: string
  fileName: string
  fileModifiedAt: string
  fileSize: number
}

export default function StatCard({
  label,
  fileName,
  fileModifiedAt,
  fileSize,
}: StatCardProps) {
  const [hover, setHover] = useState(false)

  return (
    <div
      className="flex h-fit flex-col rounded-lg border p-4 bg-white"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* label */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "size-2.5 rounded-full",
              dashboardStatCardDotColorMap[label.toLowerCase()]
            )}
          />
          <span className="font-medium">{label.toUpperCase()}</span>
        </div>

        {hover && (
          <Button size="icon-xs" variant="ghost">
            <Pencil />
          </Button>
        )}
      </div>

      {/* file name */}
      <span className="font-bold text-lg">{fileName}</span>

      {/* file modified at and file size */}
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">{format(new Date(fileModifiedAt), "MM-dd-yyyy")}</span>
        <span className="text-muted-foreground">{prettyBytes(fileSize)}</span>
      </div>
    </div>
  )
}
