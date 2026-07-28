import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/logs")({
  component: LogsLayoutComponent,
  staticData: {
    breadcrumb: "Logs",
  }
})

function LogsLayoutComponent() {
  return <Outlet />
}
