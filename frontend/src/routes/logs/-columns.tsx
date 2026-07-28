"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Link } from "@tanstack/react-router"
import type { Log } from "@/lib/schemas/logs"
import { fileStatusColorMap, sourceColorMap } from "@/lib/color-map"
import { useLogsStore } from "@/store/logs-store"
import { Edit, Minus, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Log>[] = [
  {
    accessorKey: "expander",
    header: () => null,
    cell: ({ row }) => {
      return row.getCanExpand() ? (
        <button
          onClick={row.getToggleExpandedHandler()}
          className="flex justify-center"
        >
          {row.getIsExpanded() ? <Minus size={16} /> : <Plus size={16} />}
        </button>
      ) : (
        ""
      )
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const title = row.original.title
      return <span className="font-medium">{title}</span>
    },
  },
  {
    accessorKey: "fileName",
    header: "File Name",
    cell: ({ row }) => {
      const logId = row.original.id
      const fileName = row.original.fileName

      return (
        <Link
          className="text-blue-500 hover:text-blue-700 hover:underline"
          to={`/logs/$logId`}
          params={{ logId }}
        >
          {fileName}
        </Link>
      )
    },
  },
  {
    accessorKey: "fileModifiedAt",
    header: "Date Modified",
    cell: ({ row }) => {
      const date = new Date(row.original.fileModifiedAt)

      return format(date, "MM/dd/yyyy - HH:mm:ss")
    },
  },
  {
    accessorKey: "status",
    header: () => <span className="flex justify-center">Status</span>,
    cell: ({ row }) => {
      const status = row.original.status

      return (
        <div className="flex justify-center">
          <Badge
            className={cn("text-sm capitalize", fileStatusColorMap[status])}
          >
            {status}
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: "source",
    header: () => <span className="flex justify-center">Source</span>,
    cell: ({ row }) => {
      const source = row.original.source

      return (
        <div className="flex justify-center">
          <Badge className={cn("text-sm capitalize", sourceColorMap[source])}>
            {source}
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: "actions",
    header: () => <span className="flex justify-center">Actions</span>,
    cell: ({ row }) => {
      const log = row.original
      return <ActionCell row={log} />
    },
  },
]

function ActionCell({ row }: { row: Log }) {
  const { openDialog } = useLogsStore()

  return (
    <div className="flex justify-center gap-2">
      <Tooltip>
        <TooltipTrigger onClick={() => openDialog(row.id)}>
          <Edit size={16} />
        </TooltipTrigger>
        <TooltipContent>
          <span>Edit Log</span>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
