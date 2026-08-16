import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useLogsStore } from "@/store/logs-store"
import { logsQueryOptions } from "@/lib/api/logs"
import { useQuery } from "@tanstack/react-query"
import EditLogForm from "./forms/logs/edit-log-form"
import EditLogFormSkeleton from "./skeletons/edit-log-form-skeleton"

export default function EditLogDialog() {
  const { log, open, closeDialog } = useLogsStore()
  const { data, isLoading } = useQuery(logsQueryOptions.info(log?.logId || ""))

  return (
    <Dialog open={open && log?.type === "edit"} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Log</DialogTitle>
        </DialogHeader>

        {isLoading || !data ? (
          <EditLogFormSkeleton />
        ) : (
          <EditLogForm data={data} />
        )}
      </DialogContent>
    </Dialog>
  )
}
