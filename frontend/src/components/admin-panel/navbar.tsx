import { SheetMenu } from "@/components/admin-panel/sheet-menu"
import { RouterBreadcrumb } from "../router-breadcrumb"

export function Navbar() {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-backdrop-filter:bg-background/60 dark:shadow-secondary">
      <div className="mx-4 flex h-14 items-center sm:mx-8">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
          <RouterBreadcrumb />
        </div>
        {/* <div className="flex flex-1 items-center justify-end">
          <ModeToggle />
          <UserNav />
        </div> */}
      </div>
    </header>
  )
}
