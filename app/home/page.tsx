
'use client'

import { useState, useEffect } from "react";
import StatsGroupDashboardData from "@/components/New/stats/stats_group_data";
import { startOfMonth, endOfMonth, format } from "date-fns";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CompanyVisitorsDashboard from "@/components/analytics/customer-chart";
import RevenueChart from "@/components/analytics/revenue-chart";
import Table from "@/components/Tables/Booking_table/render";
import { useCompanyContext } from "@/contexts/CompanyProvider";

export default function Page() {
  const {activeCompany}= useCompanyContext();
  const company_id = activeCompany?.uid||"ea65b045-4b98-4c80-be17-e21e8ffa2fea";
  const [year, setYear] = useState<string>("2025");
  const [month, setMonth] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Generate available years dynamically (2025-2030)
  const years = Array.from({ length: 6 }, (_, i) => (2025 + i).toString());

  const months = [
    { value: "all", label: "All Months" },
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  useEffect(() => {
    updateDateRange();
  }, [year, month]);

  // Update startDate and endDate whenever year or month changes
  const updateDateRange = () => {
    const selectedYear = parseInt(year, 10);

    if (month === "all") {
      // If "All Months" is selected, use the entire year
      const start = startOfMonth(new Date(selectedYear, 0)); // January 1st
      const end = endOfMonth(new Date(selectedYear, 11)); // December 31st

      setStartDate(format(start, "yyyy-MM-dd"));
      setEndDate(format(end, "yyyy-MM-dd"));
    } else {
      // If a specific month is selected
      const selectedMonth = parseInt(month, 10) - 1; // Convert "01" -> 0 (January)
      const start = startOfMonth(new Date(selectedYear, selectedMonth));
      const end = endOfMonth(new Date(selectedYear, selectedMonth));

      setStartDate(format(start, "yyyy-MM-dd"));
      setEndDate(format(end, "yyyy-MM-dd"));
    }
  };

  return (
    
      <SidebarInset>
        <header className="flex h-14 sm:h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-2 sm:px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage></BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-col gap-4 p-2 sm:p-4 pt-0">
          <div className="flex flex-col sm:flex-row justify-between w-full px-2 sm:px-4 md:px-8 gap-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">Dashboard</h2>

            <div className="flex gap-2 sm:gap-4 flex-row">
              {/* Month Select Dropdown */}
              <div className="flex-1 sm:w-32 md:w-48">
                <Select value={month} onValueChange={setMonth}>
                  <SelectTrigger className="h-8 sm:h-10">
                    <SelectValue placeholder="Select Month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Months</SelectLabel>
                      {months.map((monthOption) => (
                        <SelectItem key={monthOption.value} value={monthOption.value}>
                          {monthOption.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Year Select Dropdown */}
              <div className="flex-1 sm:w-32 md:w-48">
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger className="h-8 sm:h-10">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Years</SelectLabel>
                      {years.map((yearOption) => (
                        <SelectItem key={yearOption} value={yearOption}>
                          {yearOption}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <StatsGroupDashboardData
            company_id={company_id}
            startDate={startDate}
            endDate={endDate}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-0 py-2 sm:py-4 md:py-6  sm:p-4 mx-4c md:p-8c">
           
            <div className="h-64 sm:h-72 md:h-80 lg:h-96">
              <CompanyVisitorsDashboard company_id={company_id} startDate={startDate} endDate={endDate} />
            </div>
            <div className="lg:col-span-2 h-64 sm:h-72 md:h-80 lg:h-96">
              <RevenueChart company_id={company_id} />
            </div>
          </div>          
        </div>

        <div className="w-full">
        <Table company_id={company_id} startDate={startDate} endDate={endDate}/>       

        </div>
    

      </SidebarInset>
  );
}