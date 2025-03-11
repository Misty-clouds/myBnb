"use client"
import { useParams } from "next/navigation"
import { useState, useCallback } from "react"
import Table from "@/components/Tables/Booking_table/render"
import { BookingDialog } from "@/components/New/form/booking-dialog"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"

export function formatId(id: number) {
  return id < 10 ? `0${id}` : `${id}`
}

const getEndDay = (monthId: number, year: number) => {
  switch (monthId) {
    case 1: 
    case 3: 
    case 5: 
    case 7: 
    case 8: 
    case 10: 
    case 12: 
      return 31;

    case 4: 
    case 6: 
    case 9: 
    case 11: 
      return 30;

    case 2: // February (Check for leap year)
      return (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 29 : 28;

    default:
    return 31
  }
};

export default function BookingYear() {
  const { id, year, c_id } = useParams()
  const formatedId = id ? formatId(Number.parseInt(id as string)) : "00"
  const startDate = `${year}-${formatedId}-01`
  const monthId = parseInt(id as string)
  const yearNum = parseInt(year as string)
  const endDay = getEndDay(monthId, yearNum)
  const endDate = `${year}-${formatedId}-${endDay}`
   

  // State to force table refresh
  const [refreshKey, setRefreshKey] = useState(0)

  // Function to refresh the table
  const refreshTable = useCallback(() => {
    setRefreshKey((prevKey) => prevKey + 1)
  }, [])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">MyBnb</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Bookings</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex justify-between">
            <div className="mx-8 ">
              <h2 className="text-3xl font-bold mb-2">Booking Records </h2>
              <p className="text-sm text-primary">
                {" "}
                From <span className="text-primary">{startDate}</span> to{" "}
                <span className="text-primary">{endDate}</span>
              </p>
            </div>
            <BookingDialog company_id={String(c_id)} onBookingAdded={refreshTable} />
          </div>

          <div className="w-full" data-table-component>
            <Table key={refreshKey} company_id={String(c_id)} startDate={startDate} endDate={endDate} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

