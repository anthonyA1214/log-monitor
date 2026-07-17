import { env } from "@/env"
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query"
import type { AddLogs, Log, LogContent, LogInfo } from "../schemas/logs"
import camelcaseKeys from 'camelcase-keys'

async function syncLogs(): Promise<void> {
  const res = await fetch(`${env.VITE_API_URL}/api/logs/sync`, {
    method: "POST",
  })

  if (!res.ok) {
    throw new Error("Failed to sync logs")
  }
}

async function fetchLogs(): Promise<Log[]> {
  const res = await fetch(`${env.VITE_API_URL}/api/logs`)
  if (!res.ok) {
    throw new Error("Failed to fetch logs")
  }
  return await res.json()
}

async function fetchLogInfo(logId: string): Promise<LogInfo> {
  const res = await fetch(`${env.VITE_API_URL}/api/logs/${logId}`)
  if (!res.ok) {
    throw new Error(`Failed to fetch log info for ${logId}`)
  }

  return await res.json()
}

async function fetchLogContent(
  logId: string,
  offset?: number
): Promise<LogContent> {
  const url = new URL(`${env.VITE_API_URL}/api/logs/${logId}/content`)
  if (offset !== undefined) {
    url.searchParams.set("offset", String(offset))
  }

  const res = await fetch(url.toString())
  if (!res.ok) {
    throw new Error(`Failed to fetch log content for ${logId}`)
  }

  return await res.json()
}

async function addLogs(data: AddLogs): Promise<Log[]> {
  const res = await fetch(`${env.VITE_API_URL}/api/logs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      data.logs.map((log) => ({
        title: log.title,
        file_name: log.fileName,
        file_path: log.filePath,
      }))
    ),
  })

  const result = await res.json()

  if (!res.ok) {
    throw result
  }

  return await res.json()
}

async function updateLogInfo(
  logId: string,
  info: Partial<LogInfo>
): Promise<LogInfo> {
  const res = await fetch(`${env.VITE_API_URL}/api/logs/${logId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: info.title,
      file_name: info.fileName,
      file_path: info.filePath,
    }),
  })
  if (!res.ok) {
    throw new Error(`Failed to update log info for ${logId}`)
  }

  return await res.json()
}

export const logsQueryOptions = {
  all: () =>
    queryOptions({
      queryKey: ["logs"],
      queryFn: fetchLogs,
      select: (data) => camelcaseKeys(data, { deep: true }),
    }),

  info: (logId: string) =>
    queryOptions({
      queryKey: ["logs", logId],
      queryFn: () => fetchLogInfo(logId),
      select: (data) => camelcaseKeys(data, { deep: true }),
    }),

  content: (logId: string) =>
    infiniteQueryOptions({
      queryKey: ["logs", logId, "content"],
      queryFn: ({ pageParam }: { pageParam: number | undefined }) =>
        fetchLogContent(logId, pageParam),
      initialPageParam: undefined as number | undefined,
      getNextPageParam: (last) => (last.hasMore ? last.nextOffset : undefined),
      getPreviousPageParam: (first) =>
        first.offset > 0
          ? Math.max(0, first.offset - 10 * 1024 * 1024)
          : undefined,
      select: (data) => ({
        pages: data.pages.map((page) => camelcaseKeys(page, { deep: true })),
        pageParams: data.pageParams,
      }),
    }),
}

export { syncLogs, updateLogInfo, addLogs }
