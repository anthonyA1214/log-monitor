import { Button } from "@/components/ui/button"
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { slotFormSchema, type SlotForm } from "@/lib/schemas/dashboard"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

interface SlotEditorProps {
  currentSchedule?: "recursive" | "daily"
  currentTitle?: string
  availableTitles?: string[]
  onSave: (data: SlotForm) => Promise<void>
  onCancel: () => void
}

export default function SlotEditor({
  currentSchedule,
  currentTitle,
  availableTitles,
  onSave,
  onCancel,
}: SlotEditorProps) {
  const form = useForm<SlotForm>({
    resolver: zodResolver(slotFormSchema(availableTitles || [])),
    defaultValues: {
      schedule: currentSchedule || "recursive",
      title: currentTitle || "",
    },
  })

  const onSubmit = async (data: SlotForm) => {
    await onSave(data)
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex h-[15vh] flex-col justify-center rounded-lg border p-4"
    >
      <FieldGroup className="scrollbar-thin overflow-y-auto">
        <span>{currentTitle ? `Editing slot` : "Add slot"}</span>
        <Controller
          name="schedule"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field orientation="responsive" data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor="form-rhf-select-schedule">
                  Schedule
                </FieldLabel>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
              <Select
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id="form-rhf-select-schedule"
                  aria-invalid={fieldState.invalid}
                  className="min-w-30"
                >
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  <SelectItem value="recursive">Recursive</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}
        />

        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field orientation="responsive" data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor="form-rhf-select-title">Title</FieldLabel>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
              <Select
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id="form-rhf-select-title"
                  aria-invalid={fieldState.invalid}
                  className="min-w-30"
                >
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  {availableTitles?.map((title) => (
                    <SelectItem key={title} value={title}>
                      {title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
        />

        <div className="grid grid-cols-2 gap-2">
          <Button
            type="submit"
            variant="default"
            disabled={
              form.formState.isSubmitting ||
              !form.formState.isDirty
            }
          >
            {form.formState.isSubmitting ? "Saving..." : "Save"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={form.formState.isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}
