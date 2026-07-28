import { Button } from "@/components/ui/button"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { addLogs, logsQueryOptions } from "@/lib/api/logs"
import { addLogsSchema, type AddLogs } from "@/lib/schemas/logs"
import type { ServerError } from "@/lib/types/errors"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Trash2 } from "lucide-react"
import { useFieldArray, useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"

interface AddLogFormProps {
  onSuccess?: () => void
}

export default function AddLogForm({ onSuccess }: AddLogFormProps) {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    formState: { errors, isDirty, isValid },
  } = useForm<AddLogs>({
    resolver: zodResolver(addLogsSchema),
    defaultValues: {
      logs: [{ title: "", fileName: "", filePath: "" }],
    },
    mode: "onTouched",
  })

  const logs = useWatch({
    control,
    name: "logs",
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "logs",
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (formData: AddLogs) => addLogs(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: logsQueryOptions.all().queryKey,
      })
      reset()
      toast.success("Log added successfully")
      onSuccess?.()
    },
    onError: (error: ServerError) => {
      if (error?.messages) {
        Object.entries(error.messages).forEach(([index, messages]) => {
          setError(`logs.${Number(index)}.filePath`, {
            type: "server",
            message: (messages as string[])[0],
          })
        })
      } else {
        console.error("Error adding log:", error)
        toast.error("An error occurred while adding the log")
      }
    },
  })

  const onSubmit = (formData: AddLogs) => {
    const processed = {
      logs: formData.logs.map((log) => ({
        ...log,
        fileName: log.filePath.split(/[\\/]/).pop() || "",
      })),
    }
    mutate(processed)
  }

  return (
    <form id="add-log-form" onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup className="no-scrollbar max-h-[60vh] overflow-y-auto">
        {fields.map((field, index) => {
          return (
            <div key={field.id} className="space-y-5 rounded-md border p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Log {index + 1}</span>
                {index > 0 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon-sm"
                    onClick={() => remove(index)}
                  >
                    <Trash2 />
                  </Button>
                )}
              </div>

              {/* Title */}
              <Field data-invalid={!!errors.logs?.[index]?.title}>
                <FieldLabel htmlFor={`title-${index}`}>Title</FieldLabel>
                <Input
                  {...register(`logs.${index}.title`)}
                  aria-invalid={!!errors.logs?.[index]?.title}
                  id={`title-${index}`}
                  placeholder="e.g., My App Log"
                  type="text"
                />
                {errors.logs?.[index]?.title && (
                  <FieldError>{errors.logs[index].title.message}</FieldError>
                )}
              </Field>

              {/* File Path */}
              <Field data-invalid={!!errors.logs?.[index]?.filePath}>
                <FieldLabel htmlFor={`file-path-${index}`}>
                  File Path
                </FieldLabel>
                <Input
                  {...register(`logs.${index}.filePath`)}
                  aria-invalid={!!errors.logs?.[index]?.filePath}
                  id={`file-path-${index}`}
                  placeholder="e.g., /var/log/myapp.txt"
                  type="text"
                />
                {errors.logs?.[index]?.filePath && (
                  <FieldError>{errors.logs[index].filePath.message}</FieldError>
                )}
              </Field>

              {/* File Name */}
              <Field data-invalid={!!errors.logs?.[index]?.fileName}>
                <FieldLabel htmlFor={`file-name-${index}`}>
                  File Name
                </FieldLabel>
                <Input
                  value={logs?.[index]?.filePath.split(/[\\/]/).pop() || ""}
                  aria-invalid={!!errors.logs?.[index]?.fileName}
                  id={`file-name-${index}`}
                  placeholder="e.g., myapp.txt"
                  type="text"
                  disabled
                  readOnly
                />
                {errors.logs?.[index]?.fileName && (
                  <FieldError>{errors.logs[index].fileName.message}</FieldError>
                )}
              </Field>
            </div>
          )
        })}

        <Button
          type="button"
          variant="outline"
          className="mb-4 w-full border-dashed"
          onClick={() => append({ title: "", filePath: "", fileName: "" })}
        >
          Add another
        </Button>
      </FieldGroup>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" disabled={isPending || !isDirty || !isValid}>
          {isPending ? "Adding..." : "Add Log"}
        </Button>
      </DialogFooter>
    </form>
  )
}
