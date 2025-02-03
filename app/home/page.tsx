'use client'

import { SidebarNav } from "@/components/Admin/sidebar-nav"
import { RightSidebar } from "@/components/Admin/right-sidebar"
import { DashboardPage } from "@/components/Admin/pages/dashboard"



export default function DashboardLayout(){

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarNav />
      
      <main className="flex-grow overflow-auto scrollbar-hidden">
        <div className="h-full w-full overflow-y-scroll scrollbar-hide">
          <DashboardPage/>
        </div>
      </main>
      
      <RightSidebar />
    </div>
  )
}

