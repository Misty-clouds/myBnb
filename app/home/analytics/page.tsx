'use client'

import { SidebarNav } from "@/components/Admin/sidebar-nav"
import { RightSidebar } from "@/components/Admin/right-sidebar"
import Analytics from "@/components/Admin/pages/analytics"


export default function DashboardLayout(){

  return (
    <div className="flex w-full h-screen overflow-hidden">
      <SidebarNav />
      
      <main className="flex-grow overflow-auto scrollbar-hidden">
        <div className="h-full w-full overflow-y-scroll scrollbar-hide">
          <Analytics/>
        </div>
      </main>
      
     
    </div>
  )
}

 