import { ContentLayout } from "@/components/admin-panel/content-layout"
import { createFileRoute } from "@tanstack/react-router"
import { settingsQueryOptions } from "@/lib/api/settings"
import { useSuspenseQuery } from "@tanstack/react-query"
import SettingsForm from "../../components/forms/settings/settings-form"
import { Separator } from "@/components/ui/separator"
import AddLogDialog from "@/components/add-log-dialog"
import { FieldDescription } from "@/components/ui/field"

export const Route = createFileRoute("/settings/")({
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(settingsQueryOptions.all())
  },
  errorComponent: () => <div>Failed to load settings</div>,
  component: SettingsPage,
  staticData: {
    breadcrumb: "Settings",
  },
})

function SettingsPage() {
  const { data } = useSuspenseQuery(settingsQueryOptions.all())

  return (
    <ContentLayout>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col">
          <h2 className="text-2xl font-semibold tracking-tight">
            Settings Page
          </h2>
          <span className="text-sm text-muted-foreground">
            This is the settings page. You can edit your settings here.
          </span>
        </div>

        <SettingsForm data={data} />

        <Separator />

        <div className="flex flex-col gap-2">
          <div className="w-fit">
            <AddLogDialog />
          </div>
          <FieldDescription>Add a new log source to monitor.</FieldDescription>
        </div>
      </div>
    </ContentLayout>
  )
}
