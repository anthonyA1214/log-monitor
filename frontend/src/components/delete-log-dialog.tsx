import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useLogsStore } from "@/store/logs-store"
import { deleteLog, logsQueryOptions } from "@/lib/api/logs"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export default function DeleteLogDialog() {
  const queryClient = useQueryClient()
  const { log, open, closeDialog } = useLogsStore()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => {
      if (!log) {
        throw new Error("No slot selected to clear")
      }
      return deleteLog(log.logId!)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: logsQueryOptions.all().queryKey,
      })
      toast.success("Log deleted successfully")
      closeDialog()
    },
    onError: () => {
      toast.error("Failed to delete log")
    },
  })

  const handleClear = async () => {
    try {
      await mutateAsync()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Dialog open={open && log?.type === "delete"} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this log?</DialogTitle>
          <DialogDescription>
            This will delete "{log?.fileName}". The file itself won't be
            deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="submit"
            variant="default"
            onClick={handleClear}
            disabled={isPending}
          >
            {isPending ? "Deleteing..." : "Delete"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={closeDialog}
            disabled={isPending}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
