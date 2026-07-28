import { ContentLayout } from "@/components/admin-panel/content-layout"
import { logsQueryOptions } from "@/lib/api/logs"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { fileStatusColorMap, sourceColorMap } from "@/lib/color-map"
import { useEffect, useRef } from "react"

export const Route = createFileRoute("/logs/$logId")({
  loader: async ({ context: { queryClient }, params: { logId } }) => {
    await queryClient.ensureInfiniteQueryData(logsQueryOptions.content(logId))
    const info = await queryClient.ensureQueryData(logsQueryOptions.info(logId))
    return { fileName: info.fileName }
  },
  component: LogsInfoPage,
  staticData: {
    breadcrumb: (match) => match.loaderData?.fileName ?? "Log Info",
  },
})

function LogsInfoPage() {
  const logId = Route.useParams().logId
  const { data } = useSuspenseQuery(logsQueryOptions.info(logId))
  const {
    data: logContent,
    fetchPreviousPage,
    hasPreviousPage,
    isFetchingPreviousPage,
  } = useSuspenseInfiniteQuery(logsQueryOptions.content(logId))

  const date = new Date(data.fileModifiedAt)
  const fullContent = logContent?.pages.map((p) => p.content).join("")

  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current && fullContent) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight
    }
  }, [])

  return (
    <ContentLayout>
      <div className="flex h-full min-h-0 flex-col gap-4">
        <Link to="/logs">
          <Button className="w-fit" variant="outline">
            <ArrowLeft />
            <span>Back to Logs</span>
          </Button>
        </Link>

        <div className="flex h-full min-h-0 flex-col rounded-md border bg-card">
          {/* Header */}
          <div className="flex justify-between gap-4 border-b p-4">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-base font-semibold">{data.fileName}</h2>
            </div>

            {/* Status badge */}
            <div className="flex items-center gap-2">
              <Badge
                className={cn(
                  "text-sm capitalize",
                  fileStatusColorMap[data.status]
                )}
              >
                {data.status}
              </Badge>

              <Badge
                className={cn(
                  "text-sm capitalize",
                  sourceColorMap[data.source]
                )}
              >
                {data.source}
              </Badge>
            </div>
          </div>

          {/* Meta row */}
          <div className="flex border-b bg-muted/30 p-4 text-sm">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-medium text-muted-foreground">
                Date Modified
              </span>
              <span className="text-base">
                {format(date, "MM/dd/yyyy - HH:mm:ss")}
              </span>
            </div>
          </div>

          {/* Log content */}
          <div
            ref={contentRef}
            className="scrollbar-thin flex-1 overflow-y-auto"
          >
            {hasPreviousPage && (
              <div
                className="flex justify-center border-b p-2"
                style={{ overflowAnchor: "none" }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchPreviousPage()}
                  disabled={isFetchingPreviousPage}
                >
                  {isFetchingPreviousPage ? "Loading..." : "Load previous"}
                </Button>
              </div>
            )}
            <pre className="h-full p-4 font-mono text-xs leading-5 break-all whitespace-pre-wrap text-foreground">
              {fullContent}
            </pre>
          </div>
        </div>
      </div>
    </ContentLayout>
  )
}
