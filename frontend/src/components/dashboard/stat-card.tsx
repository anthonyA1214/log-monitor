import { dashboardStatCardDotColorMap } from "@/lib/color-map"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Pencil, Trash2, X } from "lucide-react"
import prettyBytes from "pretty-bytes"
import { Button } from "../ui/button"
import { useState } from "react"

interface StatCardProps {
  schedule: string
  fileName: string
  fileModifiedAt: string
  fileSize: number
  onClick: () => void
  onClear?: () => void
  isEditing?: boolean
}

export default function StatCard({
  schedule,
  fileName,
  fileModifiedAt,
  fileSize,
  onClick,
  onClear,
  isEditing = false,
}: StatCardProps) {
  const [hover, setHover] = useState(false)

  return (
    <div
      className="flex h-[15vh] flex-col rounded-lg border bg-white p-4"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* label */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "size-2.5 rounded-full",
              dashboardStatCardDotColorMap[schedule.toLowerCase()]
            )}
          />
          <span className="font-medium">{schedule.toUpperCase()}</span>
        </div>

        <div
          className={cn(
            "flex items-center gap-1",
            "md:opacity-0 md:transition-opacity",
            hover && "md:opacity-100"
          )}
        >
          {onClear && (
            <Button
              size="icon-xs"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation()
                onClear()
              }}
            >
              <Trash2 />
            </Button>
          )}

          <Button size="icon-xs" variant="ghost" onClick={onClick}>
            {isEditing ? <X /> : <Pencil />}
          </Button>
        </div>
      </div>

      <div className="flex-1" />

      {/* file name */}
      <span className="min-w-0 text-base font-bold wrap-break-word">
        {fileName}
      </span>

      {/* file modified at and file size */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {format(new Date(fileModifiedAt), "MM-dd-yyyy")}
        </span>
        <span className="text-sm text-muted-foreground">
          {prettyBytes(fileSize)}
        </span>
      </div>
    </div>
  )
}