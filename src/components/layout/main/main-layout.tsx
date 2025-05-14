import { AppSidebar } from "@/components/layout/main/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppHeader from "./app-header";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <div className="p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
