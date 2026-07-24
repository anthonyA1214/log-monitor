import { z } from "zod"

export const settingsSchema = z.object({
  logsDirectory: z.string().min(1, "Logs directory is required"),
  commonPrefix: z.array(z.string().min(1, "Prefix cannot be empty")).optional(),
})

export type Settings = z.infer<typeof settingsSchema>
