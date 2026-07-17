import { env } from "@/env"
import type { Settings } from "../schemas/settings"
import camelcaseKeys from "camelcase-keys"
import { queryOptions } from "@tanstack/react-query"

async function fetchSettings(): Promise<Settings> {
  const res = await fetch(`${env.VITE_API_URL}/api/settings`)

  if (!res.ok) {
    throw new Error("Failed to fetch settings")
  }

  return await res.json()
}

async function updateSettings(settings: Settings): Promise<Settings> {
  const res = await fetch(`${env.VITE_API_URL}/api/settings`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      logs_directory: settings.logsDirectory,
      common_prefix: settings.commonPrefix,
    }),
  })

  if (!res.ok) {
    throw new Error("Failed to update settings")
  }

  return await res.json()
}

export const settingsQueryOptions = {
  all: () =>
    queryOptions({
      queryKey: ["settings"],
      queryFn: fetchSettings,
      select: (data) => camelcaseKeys(data, { deep: true }),
    }),
}

export { updateSettings }
