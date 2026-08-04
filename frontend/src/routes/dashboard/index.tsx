import { ContentLayout } from "@/components/admin-panel/content-layout"
import EmptyStatCard from "@/components/dashboard/empty-stat-card"
import OnDemandCard from "@/components/dashboard/on-demand-card"
import StatCard from "@/components/dashboard/stat-card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"
import { clearSlot, dashboardQueryOptions } from "@/lib/api/dashboard"
import { useSlotEditorStore } from "@/store/slot-editor-store"
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { FileX } from "lucide-react"
import { Fragment } from "react/jsx-runtime"

export const Route = createFileRoute("/dashboard/")({
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(dashboardQueryOptions.slots())
  },
  errorComponent: ({ error }) => (
    <div className="flex min-h-svh items-center justify-center">
      <p className="text-muted-foreground">{error.message}</p>
    </div>
  ),
  component: RouteComponent,
  staticData: {
    breadcrumb: "Dashboard",
  },
})

function RouteComponent() {
  const { openDialog } = useSlotEditorStore()
  const queryClient = useQueryClient()

  const slots = useSuspenseQuery({
    ...dashboardQueryOptions.slots(),
  })

  const onDemandExports = useSuspenseQuery({
    ...dashboardQueryOptions.exports(),
  })

  const { mutate: clearSlotMutate } = useMutation({
    mutationFn: ({
      section,
      slotNumber,
    }: {
      section: string
      slotNumber: number
    }) => clearSlot(section, slotNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: dashboardQueryOptions.slots().queryKey,
      })
    },
  })

  return (
    <ContentLayout>
      <div className="flex h-full min-h-0 flex-col gap-4">
        {/* header */}
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Dashboard Page
          </h2>

          <span className="text-sm text-muted-foreground">
            Overview of log sync jobs, priority tasks, scheduled runs, and
            on-demand exports.
          </span>
        </div>

        <div className="scrollbar-thin grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-y-auto lg:grid-cols-[minmax(0,2fr)_minmax(260px,0.5fr)] lg:overflow-hidden">
          {/* left side */}
          <div className="flex flex-col gap-y-4 lg:min-h-0 lg:overflow-y-auto">
            {/* priority */}
            <div className="flex flex-col gap-y-4">
              <div className="flex items-center gap-4">
                <span className="font-bold uppercase">PRIORITY</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="grid grid-cols-1 gap-4 rounded-lg border p-4 xs:grid-cols-2 md:grid-cols-4">
                {slots.data.priority.map((item) =>
                  item.log !== null ? (
                    <StatCard
                      key={`priority-card-${item.slotNumber}`}
                      schedule={item.schedule}
                      fileName={item.log.fileName}
                      fileModifiedAt={item.log.fileModifiedAt}
                      fileSize={item.log.fileSize}
                      onClick={() =>
                        openDialog(
                          "priority",
                          item?.slotNumber,
                          item?.log?.title,
                          item?.schedule
                        )
                      }
                      onClear={() =>
                        clearSlotMutate({
                          section: "priority",
                          slotNumber: item.slotNumber,
                        })
                      }
                    />
                  ) : (
                    <EmptyStatCard
                      key={`priority-empty-stat-card-${item.slotNumber}`}
                      onClick={() => openDialog("priority", item?.slotNumber)}
                    />
                  )
                )}
              </div>
            </div>

            {/* less priority */}
            <div className="flex flex-col gap-y-4">
              <div className="flex items-center gap-4">
                <span className="font-bold uppercase">LESS PRIORITY</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="grid grid-cols-1 gap-4 rounded-lg border p-4 xs:grid-cols-2 md:grid-cols-4">
                {slots.data.lessPriority.map((item) =>
                  item.log !== null ? (
                    <StatCard
                      key={`lessPriority-card-${item.slotNumber}`}
                      schedule={item.schedule}
                      fileName={item.log.fileName}
                      fileModifiedAt={item.log.fileModifiedAt}
                      fileSize={item.log.fileSize}
                      onClick={() =>
                        openDialog(
                          "lessPriority",
                          item?.slotNumber,
                          item?.log?.title,
                          item?.schedule
                        )
                      }
                      onClear={() =>
                        clearSlotMutate({
                          section: "lessPriority",
                          slotNumber: item.slotNumber,
                        })
                      }
                    />
                  ) : (
                    <EmptyStatCard
                      key={`lessPriority-empty-stat-card-${item.slotNumber}`}
                      onClick={() =>
                        openDialog("lessPriority", item?.slotNumber)
                      }
                    />
                  )
                )}
              </div>
            </div>
          </div>

          {/* right side */}
          <div className="flex min-h-0 flex-col gap-y-4">
            <div className="flex items-center gap-4">
              <span className="font-bold uppercase">ON DEMAND</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* cards */}
            <div className="scrollbar-thin max-h-80 min-h-60 flex-1 overflow-y-auto rounded-lg border lg:max-h-none lg:min-h-0">
              {onDemandExports.data && onDemandExports.data.length > 0 ? (
                onDemandExports.data.map((item, i) => (
                  <Fragment key={`on-demand-card-${i}`}>
                    {i !== 0 && <Separator />}

                    <OnDemandCard
                      fileName={item.fileName}
                      fileModifiedAt={item.fileModifiedAt}
                      fileSize={item.fileSize}
                    />
                  </Fragment>
                ))
              ) : (
                <Empty className="h-full">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <FileX />
                    </EmptyMedia>
                    <EmptyTitle>No exports yet</EmptyTitle>
                    <EmptyDescription>
                      On-demand exports will show up here once created.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )}
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  )
}