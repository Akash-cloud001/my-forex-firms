import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "@/components/crm/app-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider >
      <AppSidebar />
      <main className="w-full bg-background min-h-screen">
        <SidebarTrigger />
        <div className="mt-16 w-full">
        {children}
        </div>
      </main>
    </SidebarProvider>
  )
}