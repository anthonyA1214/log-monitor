import { ContentLayout } from "@/components/admin-panel/content-layout"
import { DataTable } from "./-logs-data-table"
import EditLogDialog from "@/components/edit-log-dialog"
import { useMilitaryTime } from "@/hooks/use-military-time"
import { logsQueryOptions, syncLogs } from "@/lib/api/logs"
import { useLogsStore } from "@/store/logs-store"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { columns } from "./-columns"

export const Route = createFileRoute("/logs/")({
  loader: ({ context: { queryClient } }) => {
    syncLogs() // Sync logs on page load
    return queryClient.ensureQueryData(logsQueryOptions.all())
  },
  errorComponent: ({ error }) => (
    <div className="flex min-h-svh items-center justify-center">
      <p className="text-muted-foreground">{error.message}</p>
    </div>
  ),
  component: LogsPage,

})

function LogsPage() {
  const time = useMilitaryTime()
  const { data = [] } = useSuspenseQuery({
    ...logsQueryOptions.all(),
    refetchInterval: 5000, // Refetch every 5 seconds
  })
  const { logId } = useLogsStore()

  return (
    <ContentLayout>
      <div className="flex h-full min-h-0 flex-col gap-4">
        {/* header */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Logs Page</h2>

            <div className="flex items-center gap-2">
              {/* military time */}
              <span className="font-mono text-sm text-muted-foreground">
                {time}
              </span>
            </div>
          </div>

          <span className="text-sm text-muted-foreground">
            Browse, manage, and monitor log file entries.
          </span>
        </div>

        {/* table */}
        <DataTable columns={columns} data={data} />
      </div>

      {logId && <EditLogDialog />}
    </ContentLayout>
  )
}
