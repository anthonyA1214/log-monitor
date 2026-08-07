import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "../ui/button"
import { useSlotEditorStore } from "@/store/slot-editor-store"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { clearSlot, dashboardQueryOptions } from "@/lib/api/dashboard"

export default function ClearSlotDialog() {
  const queryClient = useQueryClient()
  const { open, closeDialog, editingSlot } = useSlotEditorStore()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () =>
      clearSlot(editingSlot?.section!, editingSlot?.slotNumber!),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: dashboardQueryOptions.slots().queryKey,
      })
      closeDialog()
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
    <Dialog
      open={open && editingSlot?.type === "clear"}
      onOpenChange={closeDialog}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Clear this slot?</DialogTitle>
          <DialogDescription>
            This will clear "{editingSlot?.currentTitle}". The data itself won't
            be deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="submit"
            variant="default"
            onClick={handleClear}
            disabled={isPending}
          >
            {isPending ? "Clearing..." : "Clear"}
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
