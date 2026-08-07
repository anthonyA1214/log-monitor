import { create } from "zustand"

interface SlotEditorState {
  editingSlot: {
    currentTitle?: string
    currentSchedule?: "recursive" | "daily"
    section: "priority" | "lessPriority"
    slotNumber: number
    type: "edit/add" | "clear"
  } | null
  open: boolean
  openDialog: (
    section: "priority" | "lessPriority",
    slotNumber: number | null,
    type: "edit/add" | "clear",
    currentTitle?: string,
    currentSchedule?: "recursive" | "daily"
  ) => void
  closeDialog: () => void
}

export const useSlotEditorStore = create<SlotEditorState>((set) => ({
  editingSlot: null,
  open: false,
  openDialog: (section, slotNumber, type, currentTitle, currentSchedule) =>
    set({
      editingSlot:
        slotNumber !== null
          ? { currentTitle, currentSchedule, section, slotNumber, type }
          : null,
      open: slotNumber !== null,
    }),
  closeDialog: () => {
    set({ open: false })
    setTimeout(() => set({ editingSlot: null }), 200)
  },
}))
