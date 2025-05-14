import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

import { Separator } from "@/components/ui/separator";
import {
  SidebarTrigger
} from "@/components/ui/sidebar";


import { TopbarNotification } from "./topbar-notification";
import { Fragment } from "react/jsx-runtime";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

export default function AppHeader() {
  const breadcrumbs = useBreadcrumb();
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4 " />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((title, index) => (
              <Fragment key={title}>
                <BreadcrumbItem>
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="ml-auto px-8">
        <TopbarNotification />
      </div>
    </header>
  )
}
