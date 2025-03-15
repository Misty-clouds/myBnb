'use client'
import { PropertiesDialog } from "@/components/New/form/dialog/properties-dialog";
import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import PropertiesPage from "@/components/New/sections/properties/page";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Page() {
  const company_id = "ea65b045-4b98-4c80-be17-e21e8ffa2fea";
  const [Year, setYear] = useState<string>("2025");

  return (
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Properties Overview</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage></BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-col gap-4 p-4 pt-0">
        <div className="flex flex-col sm:flex-row justify-between w-full px-2 sm:px-4 md:px-8 gap-2">

        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">Properties</h2>
        <div className="flex gap-2 sm:gap-4 flex-row">

          {/* Year Selection Dropdown */}
          

          <div className="flex-1 sm:w-32 md:w-48">
            <Select value={Year} onValueChange={setYear}>
              <SelectTrigger className="h-8 sm:h-10">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Years</SelectLabel>
                  {Array.from({ length: 6 }, (_, i) => 2023 + i).map((year) => (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

            <PropertiesDialog company_id={company_id}/>
            </div>


          </div>

          <div className="w-full">
            <PropertiesPage year={Year} company_id={company_id} />

          </div>
        </div>
      </SidebarInset>
  );
}
