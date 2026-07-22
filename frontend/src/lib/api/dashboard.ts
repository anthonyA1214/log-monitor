import { env } from "@/env"
import { queryOptions } from "@tanstack/react-query"
import type { SlotForm, Slots } from "../schemas/dashboard"
import camelcaseKeys from "camelcase-keys"
import snakecaseKeys from "snakecase-keys"
import snakeCase from "lodash.snakecase"

async function fetchSlots(): Promise<Slots> {
  const res = await fetch(`${env.VITE_API_URL}/api/dashboard/slots`)

  if (!res.ok) {
    throw new Error("Failed to fetch slots")
  }

  return res.json()
}

async function fetchTitles(): Promise<string[]> {
  const res = await fetch(`${env.VITE_API_URL}/api/dashboard/titles`)

  if (!res.ok) {
    throw new Error("Failed to fetch titles")
  }

  return res.json()
}

async function assignSlot(
  section: string,
  slotNumber: number,
  data: SlotForm
): Promise<void> {
  const payload = snakecaseKeys(
    { schedule: data.schedule, title: data.title },
    { deep: true }
  )
  section = snakeCase(section)

  const res = await fetch(
    `${env.VITE_API_URL}/api/dashboard/slots/${section}/${slotNumber}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  )

  if (!res.ok) {
    throw new Error("Failed to assign slot")
  }

  return res.json()
}

export const dashboardQueryOptions = {
  slots: () =>
    queryOptions({
      queryKey: ["dashboard", "slots"],
      queryFn: fetchSlots,
      select: (data) => camelcaseKeys(data, { deep: true }),
    }),

  titles: () =>
    queryOptions({
      queryKey: ["dashboard", "titles"],
      queryFn: fetchTitles,
    }),
}

export { assignSlot }
