import { create } from "zustand"

interface LogsState {
  log: {
    logId: string | null
    type: "edit" | "delete"
    fileName: string | null
  } | null
  open: boolean

  setLog: (log: {
    logId: string | null
    type: "edit" | "delete"
    fileName: string
  }) => void
  setOpen: (open: boolean) => void

  openDialog: (
    logId: string | null,
    type: "edit" | "delete",
    fileName?: string
  ) => void
  closeDialog: () => void
}

export const useLogsStore = create<LogsState>((set) => ({
  log: null,
  open: false,

  setLog: (log) => set({ log }),
  setOpen: (open) => set({ open }),

  openDialog: (logId, type, fileName) =>
    set({
      log: {
        logId,
        type,
        fileName: fileName || null,
      },
      open: true,
    }),
  closeDialog: () => {
    set({ open: false })
    setTimeout(() => set({ log: null }), 200)
  },
}))
