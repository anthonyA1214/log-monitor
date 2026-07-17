import { ContentLayout } from "@/components/admin-panel/content-layout"
import EmptyStatCard from "@/components/dashboard/empty-stat-card"
import OnDemandCard from "@/components/dashboard/on-demand-card"
import StatCard from "@/components/dashboard/stat-card"
import { Separator } from "@/components/ui/separator"
import { dashboardQueryOptions } from "@/lib/api/dashboard"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
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
  const slots = useSuspenseQuery({
    ...dashboardQueryOptions.slots(),
  })

  console.log(slots.data)

  const titles = useSuspenseQuery({
    ...dashboardQueryOptions.titles(),
  })

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
                {slots.data.priority.map((item, i) => item.log !== null ? (
                  <StatCard key={`priority-card-${i}`} schedule={item.schedule} fileName={item.log.fileName} fileModifiedAt={item.log.fileModifiedAt} fileSize={item.log.fileSize} />
                ) : (
                  <EmptyStatCard key={`empty-stat-card-${i}`} />
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
                <StatCard schedule="daily" fileName="test" fileModifiedAt="2026-04-01" fileSize={1000} />
                <StatCard schedule="daily" fileName="test" fileModifiedAt="2026-04-01" fileSize={1000} />
                <StatCard schedule="daily" fileName="test" fileModifiedAt="2026-04-01" fileSize={1000} />
                <StatCard schedule="daily" fileName="test" fileModifiedAt="2026-04-01" fileSize={1000} />
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
