'use client'
import { ExpensesDialog } from "@/components/New/form/dialog/expenses-dialog";
import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import ExpensesPage from "@/components/New/sections/expenses/page";
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
import { useCompanyContext } from "@/contexts/CompanyProvider";

export default function Page() {
  const [Year, setYear] = useState<string>("2025");
  const {activeCompany}= useCompanyContext();
  const company_id = activeCompany?.uid||"ea65b045-4b98-4c80-be17-e21e8ffa2fea";


  return (
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Expenses Overview</BreadcrumbLink>
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

        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">Expenses</h2>
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

            <ExpensesDialog company_id={company_id}/>
            </div>


          </div>

          <div className="w-full">
            <ExpensesPage year={Year} company_id={company_id} />

          </div>
        </div>
      </SidebarInset>
  );
}
