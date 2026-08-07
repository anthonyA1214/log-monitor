import { dashboardStatCardDotColorMap } from "@/lib/color-map"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Eraser, Pencil } from "lucide-react"
import prettyBytes from "pretty-bytes"
import { Button } from "../ui/button"
import { useState } from "react"
import { useIsMobile } from "@/hooks/use-is-mobile"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

interface StatCardProps {
  schedule: string
  fileName: string
  fileModifiedAt: string
  fileSize: number
  onEdit: () => void
  onClear?: () => void
}

export default function StatCard({
  schedule,
  fileName,
  fileModifiedAt,
  fileSize,
  onEdit,
  onClear,
}: StatCardProps) {
  const [hover, setHover] = useState(false)
  const isMobile = useIsMobile()

  return (
    <div
      className="flex h-[15vh] flex-col rounded-lg border bg-white p-4"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* label */}
      <div className="flex flex-wrap items-center justify-between gap-x-4">
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
            isMobile ? "opacity-100" : hover ? "opacity-100" : "opacity-0"
          )}
        >
          <Tooltip>
            <TooltipTrigger>
              <Button size="icon-xs" variant="ghost" onClick={onEdit}>
                <Pencil />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Slot</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Button size="icon-xs" variant="ghost" onClick={onClear}>
                <Eraser />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear Slot</p>
            </TooltipContent>
          </Tooltip>
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
