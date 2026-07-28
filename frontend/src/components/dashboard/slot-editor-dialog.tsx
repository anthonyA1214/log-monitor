import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { assignSlot, dashboardQueryOptions } from "@/lib/api/dashboard";
import type { SlotForm } from "@/lib/schemas/dashboard";
import { useSlotEditorStore } from "@/store/slot-editor-store"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import SlotEditor from "../forms/dashboard/slot-editor";

export default function SlotEditorDialog() {
  const queryClient = useQueryClient()

  const { open, closeDialog, editingSlot } = useSlotEditorStore();
  const titles = useSuspenseQuery({
    ...dashboardQueryOptions.titles(),
  })

  const { mutateAsync } = useMutation({
    mutationFn: (data: SlotForm) =>
      assignSlot(editingSlot?.section!, editingSlot?.slotNumber!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: dashboardQueryOptions.slots().queryKey,
      })
      closeDialog()
    },
  })

  const handleSave = async (data: SlotForm) => {
    await mutateAsync(data)
  }

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingSlot?.currentTitle ? `Editing slot` : "Add slot"}</DialogTitle>
        </DialogHeader>

        <SlotEditor
          currentTitle={editingSlot?.currentTitle}
          currentSchedule={editingSlot?.currentSchedule}
          availableTitles={titles.data}
          onSave={handleSave}
          onCancel={closeDialog}
        />
      </DialogContent>
    </Dialog>
  )
}
