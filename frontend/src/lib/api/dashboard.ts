import { env } from "@/env";
import { queryOptions } from "@tanstack/react-query";
import type { Slots } from "../schemas/dashboard";
import camelcaseKeys from "camelcase-keys";

async function fetchSlots(): Promise<Slots> {
  const res = await fetch(`${env.VITE_API_URL}/api/dashboard/slots`)

  if (!res.ok) {
    throw new Error("Failed to fetch slots")
  }

  return res.json();
}

async function fetchTitles(): Promise<string[]> {
  const res = await fetch(`${env.VITE_API_URL}/api/dashboard/titles`)

  if (!res.ok) {
    throw new Error("Failed to fetch titles")
  }

  return res.json()
}

export const dashboardQueryOptions = {
  slots: () =>
    queryOptions({
      queryKey: ["dashboard", "slots"],
      queryFn: fetchSlots,
      select: (data) => camelcaseKeys(data, { deep: true })
    }),

  titles: () =>
    queryOptions({
      queryKey: ["dashboard", "titles"],
      queryFn: fetchTitles,
    })
}
