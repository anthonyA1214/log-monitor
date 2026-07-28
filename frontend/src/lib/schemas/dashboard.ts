import { z } from "zod"

export const logSchema = z.object({
  id: z.string(),
  title: z.string(),
  fileName: z.string(),
  filePath: z.string(),
  fileModifiedAt: z.string(),
  fileSize: z.number(),
})

export const slotSchema = z.object({
  slotNumber: z.number(),
  log: logSchema,
  schedule: z.enum(["recursive", "daily"]),
})

export const slotsSchema = z.object({
  priority: z.array(slotSchema),
  lessPriority: z.array(slotSchema),
})

export const slotFormSchema = (titles: string[]) =>
  z.object({
    schedule: z.enum(["recursive", "daily"]),
    title: z
      .string()
      .min(1, "Title is required")
      .refine((val) => titles.includes(val), {
        message: "Selected log title is not valid",
      }),
  })

export const onDemandExportsSchema = z.object({
  fileName: z.string(),
  fileModifiedAt: z.string(),
  fileSize: z.number(),
})

export type Slots = z.infer<typeof slotsSchema>
export type SlotForm = z.infer<ReturnType<typeof slotFormSchema>>
export type OnDemandExports = z.infer<typeof onDemandExportsSchema>
