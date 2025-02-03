'use client'

import { SidebarNav } from "@/components/Admin/sidebar-nav"
import Expenses from "@/components/Admin/pages/expenses";


export default function DashboardLayout(){

// place holder for booking form
  const apartments = [
    { id: "1", name: "Apartment A" },
    { id: "2", name: "Apartment B" },
  ];

  return (
    <div className="flex w-full h-screen overflow-hidden">
      <SidebarNav />
      
      <main className="flex-grow overflow-auto scrollbar-hidden">
        <div className="h-full w-full  overflow-y-scroll scrollbar-hide">

          <Expenses/>
        </div>
      </main>    
    </div>
  )
}

