import { ContentLayout } from "@/components/admin-panel/content-layout"
import OnDemandCard from "@/components/dashboard/on-demand-card"
import StatCard from "@/components/dashboard/stat-card"
import { Separator } from "@/components/ui/separator"
import { createFileRoute } from "@tanstack/react-router"
import { Fragment } from "react/jsx-runtime"
export const Route = createFileRoute("/dashboard/_dashboard/")({
  component: RouteComponent,
})

function RouteComponent() {
  const onDemandExports = [
    {
      fileName: "Artrade",
      fileModifiedAt: "2026-06-10",
      fileSize: 512345677,
    },
    {
      fileName: "Bexchange",
      fileModifiedAt: "2026-06-08",
      fileSize: 89345120,
    },
    {
      fileName: "Cryptovault",
      fileModifiedAt: "2026-06-05",
      fileSize: 1345678900,
    },
    {
      fileName: "Dexmarket",
      fileModifiedAt: "2026-05-29",
      fileSize: 234567890,
    },
    {
      fileName: "Etherscan_Export",
      fileModifiedAt: "2026-05-22",
      fileSize: 67890123,
    },
    {
      fileName: "Fintrack",
      fileModifiedAt: "2026-05-15",
      fileSize: 456789012,
    },
    {
      fileName: "Grainledger",
      fileModifiedAt: "2026-05-10",
      fileSize: 123456789,
    },
    {
      fileName: "Hashflow",
      fileModifiedAt: "2026-05-02",
      fileSize: 987654321,
    },
    {
      fileName: "Ionpay",
      fileModifiedAt: "2026-04-25",
      fileSize: 34567890,
    },
    {
      fileName: "Jettonswap",
      fileModifiedAt: "2026-04-18",
      fileSize: 156789012,
    },
  ]

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
                <StatCard label="daily" fileName="test" fileModifiedAt="2026-04-01" fileSize={1000} />
                <StatCard label="daily" fileName="test" fileModifiedAt="2026-04-01" fileSize={1000} />
                <StatCard label="daily" fileName="test" fileModifiedAt="2026-04-01" fileSize={1000} />
                <StatCard label="daily" fileName="test" fileModifiedAt="2026-04-01" fileSize={1000} />
              </div>
            </div>

            {/* less priority */}
            <div className="flex flex-col gap-y-4">
              <div className="flex items-center gap-4">
                <span className="font-bold uppercase">LESS PRIORITY</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="grid grid-cols-4 gap-4 border p-4 rounded-lg">
                <StatCard label="daily" fileName="test" fileModifiedAt="2026-04-01" fileSize={1000} />
                <StatCard label="daily" fileName="test" fileModifiedAt="2026-04-01" fileSize={1000} />
                <StatCard label="daily" fileName="test" fileModifiedAt="2026-04-01" fileSize={1000} />
                <StatCard label="daily" fileName="test" fileModifiedAt="2026-04-01" fileSize={1000} />
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
              {onDemandExports.map((item, i) => (
                <Fragment key={`on-demand-card-${i}`}>
                  {i !== 0 && <Separator />}

                  <OnDemandCard
                    fileName={item.fileName}
                    fileModifiedAt={item.fileModifiedAt}
                    fileSize={item.fileSize}
                  />
                </Fragment>
              ))}
            </div>
          </div>
          {/*  */}
        </div>
      </div>
    </ContentLayout>
  )
}
