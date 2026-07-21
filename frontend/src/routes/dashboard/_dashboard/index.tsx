import { ContentLayout } from "@/components/admin-panel/content-layout"
import EmptyStatCard from "@/components/dashboard/empty-stat-card"
import OnDemandCard from "@/components/dashboard/on-demand-card"
import StatCard from "@/components/dashboard/stat-card"
import SlotEditor from "@/components/forms/dashboard/slot-editor"
import { Separator } from "@/components/ui/separator"
import { assignSlot, dashboardQueryOptions } from "@/lib/api/dashboard"
import type { SlotForm } from "@/lib/schemas/dashboard"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { Fragment } from "react/jsx-runtime"
export const Route = createFileRoute("/dashboard/_dashboard/")({
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(dashboardQueryOptions.slots())
  },
  errorComponent: ({ error }) => (
    <div className="flex min-h-svh items-center justify-center">
      <p className="text-muted-foreground">{error.message}</p>
    </div>
  ),
  component: RouteComponent,
})

function RouteComponent() {
  const [editingSlot, setEditingSlot] = useState<{ section: string, slotNumber: number } | null>(null);

  const queryClient = useQueryClient()

  const slots = useSuspenseQuery({
    ...dashboardQueryOptions.slots(),
  })

  const titles = useSuspenseQuery({
    ...dashboardQueryOptions.titles(),
  })

  const { mutateAsync } = useMutation({
    mutationFn: (data: SlotForm) => assignSlot(editingSlot?.section!, editingSlot?.slotNumber!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: dashboardQueryOptions.slots().queryKey,
      })
      setEditingSlot(null)
    },
  })

  const handleSave = async (data: SlotForm) => {
    await mutateAsync(data)
  }

  return (
    <ContentLayout>
      <div className="flex h-full min-h-0 flex-col gap-4">
        {/* header */}
        <div className="flex flex-col">
          <h2 className="text-2xl font-semibold tracking-tight">
            Dashboard Page
          </h2>

          <span className="text-sm text-muted-foreground">
            Overview of log sync jobs, priority tasks, scheduled runs, and
            on-demand exports.
          </span>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-[2fr_0.5fr] gap-4">
          {/* left side */}
          <div className="flex flex-col gap-y-4">
            {/* priority */}
            <div className="flex flex-col gap-y-4">
              <div className="flex items-center gap-4">
                <span className="font-bold uppercase">PRIORITY</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="grid grid-cols-4 gap-4 border p-4 rounded-lg">
                {slots.data.priority.map((item, i) =>
                  editingSlot?.section === "priority" && editingSlot?.slotNumber === item?.slotNumber ? (
                    <SlotEditor
                      key={`slot-editor-priority-${i}`}
                      currentSchedule={item?.schedule}
                      currentTitle={item?.log?.fileName}
                      availableTitles={titles.data}
                      onSave={handleSave}
                      onCancel={() => {
                        setEditingSlot(null)
                      }}
                    />
                  ) : item.log !== null ? (<StatCard key={`priority-card-${i}`} schedule={item.schedule} fileName={item.log.fileName} fileModifiedAt={item.log.fileModifiedAt} fileSize={item.log.fileSize} />
                  ) : (
                    <EmptyStatCard
                      key={`priority-empty-stat-card-${i}`}
                      onClick={() => setEditingSlot({ section: "priority", slotNumber: item?.slotNumber })}
                    />
                  ))}
              </div>
            </div>

            {/* less priority */}
            <div className="flex flex-col gap-y-4">
              <div className="flex items-center gap-4">
                <span className="font-bold uppercase">LESS PRIORITY</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="grid grid-cols-4 gap-4 border p-4 rounded-lg">
                {slots.data.lessPriority.map((item, i) =>
                  editingSlot?.section === "lessPriority" && editingSlot?.slotNumber === item?.slotNumber ? (
                    <SlotEditor
                      key={`slot-editor-lessPriority-${i}`}
                      currentSchedule={item?.schedule}
                      currentTitle={item?.log?.fileName}
                      availableTitles={titles.data}
                      onSave={handleSave}
                      onCancel={() => {
                        setEditingSlot(null)
                      }}
                    />
                  ) : item.log !== null ? (<StatCard key={`lessPriority-card-${i}`} schedule={item.schedule} fileName={item.log.fileName} fileModifiedAt={item.log.fileModifiedAt} fileSize={item.log.fileSize} />
                  ) : (
                    <EmptyStatCard
                      key={`lessPriority-empty-stat-card-${i}`}
                      onClick={() => setEditingSlot({ section: "lessPriority", slotNumber: item?.slotNumber })}
                    />
                  ))}
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
            <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto rounded-lg border">

              {/*   {onDemandExports.map((item, i) => ( */}
              {/*     <Fragment key={`on-demand-card-${i}`}> */}
              {/*       {i !== 0 && <Separator />} */}
              {/**/}
              {/*       <OnDemandCard */}
              {/*         fileName={item.fileName} */}
              {/*         fileModifiedAt={item.fileModifiedAt} */}
              {/*         fileSize={item.fileSize} */}
              {/*       /> */}
              {/*     </Fragment> */}
              {/*   ))} */}
              {/* </div> */}
            </div>
            {/*  */}
          </div>
        </div>
      </div>
    </ContentLayout>
  )
}
