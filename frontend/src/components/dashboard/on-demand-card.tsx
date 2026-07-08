import { format } from "date-fns"
import prettyBytes from "pretty-bytes"

interface OnDemandCardProps {
  fileName: string
  fileModifiedAt: string
  fileSize: number
}

export default function OnDemandCard({
  fileName,
  fileModifiedAt,
  fileSize,
}: OnDemandCardProps) {
  return (
    <div className="flex h-fit flex-col justify-center gap-y-2 p-4">
      <div className="flex items-center justify-between">
        <span className="text-base font-medium">{fileName}</span>
        <span className="text-sm text-muted-foreground">
          {format(new Date(fileModifiedAt), "MM-dd-yyyy")}
        </span>
      </div>
      <span className="text-sm text-muted-foreground">
        {prettyBytes(fileSize)}
      </span>
    </div>
  )
}
