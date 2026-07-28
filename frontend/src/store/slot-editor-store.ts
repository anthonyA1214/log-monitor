import { create } from "zustand"

interface SlotEditorState {
  editingSlot: {
    currentTitle?: string
    currentSchedule?: "recursive" | "daily"
    section: "priority" | "lessPriority"
    slotNumber: number
  } | null
  open: boolean
  openDialog: (
    section: "priority" | "lessPriority",
    slotNumber: number | null,
    currentTitle?: string,
    currentSchedule?: "recursive" | "daily"
  ) => void
  closeDialog: () => void
}

export const useSlotEditorStore = create<SlotEditorState>((set) => ({
  editingSlot: null,
  open: false,
  openDialog: (section, slotNumber, currentTitle, currentSchedule) =>
    set({
      editingSlot:
        slotNumber !== null
          ? { currentTitle, currentSchedule, section, slotNumber }
          : null,
      open: slotNumber !== null,
    }),
  closeDialog: () =>
    set({
      editingSlot: null,
      open: false,
    }),
}))
