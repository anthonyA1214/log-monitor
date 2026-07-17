import { z } from "zod";

export const logSchema = z.object({
  id: z.string(),
  fileName: z.string(),
  filePath: z.string(),
  fileModifiedAt: z.string(),
  fileSize: z.number(),
})

export const slotSchema = z.object({
  slotNumber: z.string(),
  log: logSchema,
  schedule: z.string(),
})

export const slotsSchema = z.object({
  priority: z.array(slotSchema),
  lessPriority: z.array(slotSchema),
})

export const addSlotSchema = (titles: string[]) => z.object({
  schedule: z.enum(["recursive", "daily"]),
  title: z.string().min(1, "Title is required").refine((val) => titles.includes(val), {
    message: "Selected log title is not valid",
  }),
})

export type Slots = z.infer<typeof slotsSchema>
export type AddSlot = z.infer<ReturnType<typeof addSlotSchema>>

