import ClearSlotDialog from "@/components/dashboard/clear-slot-dialog"
import SlotEditorDialog from "@/components/dashboard/slot-editor-dialog"
import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayoutComponent,
})

function DashboardLayoutComponent() {
  return (
    <>
      <Outlet />
      <SlotEditorDialog />
      <ClearSlotDialog />
    </>
  )
}
