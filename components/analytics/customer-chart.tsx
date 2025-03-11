"use client"

import { useState, useEffect } from "react"
import { RadialBar, RadialBarChart } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { getUserBookingDetails } from "@/helper-functions"

export default function CompanyVisitorsDashboard({
  company_id,
  startDate,
  endDate,
}: {
  company_id: string
  startDate: string
  endDate: string
}) {
  const [bookingData, setBookingData] = useState<{
    totalRecords: number
    bookingCounts: { online: number; phone: number; "in-person": number }
    percentage: { online: number; phone: number; "in-person": number }
  } | null>(null)

  useEffect(() => {
    (async () => {
      const result = await getUserBookingDetails(company_id, startDate, endDate)
      if (result) {
        setBookingData(result)
      }
    })()
  }, [company_id, startDate, endDate])

  // Default to 0 if no data is available yet
  const totalRecords = bookingData?.totalRecords || 0
  const onlineValue = bookingData?.percentage.online || 0
  const phoneValue = bookingData?.percentage.phone || 0
  const inPersonValue = bookingData?.percentage["in-person"] || 0

  
 const isEmpty = onlineValue === 0 && phoneValue === 0 && inPersonValue === 0
  const chartData = [
    { name: "Online", value: isEmpty ? 50 : onlineValue, fill: "#3b82f6", count: bookingData?.bookingCounts.online || 0 },
    { name: "In-Person", value: isEmpty ? 20 : inPersonValue, fill: "#06b6d4", count: bookingData?.bookingCounts["in-person"] || 0 },
    { name: "Phone", value: isEmpty ? 30 : phoneValue, fill: "#E31B54", count: bookingData?.bookingCounts.phone || 0 }, // Replaced pink color
  ]

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-0 space-y-0">
        <CardTitle className="text-sm sm:text-base md:text-lg font-medium">
          Users Booking Methods
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between pt-2">
        <div className="flex justify-center items-center flex-1 relative">
          <ChartContainer
            config={{
              organic: {
                label: "Online",
                color: "#d946ef",
              },
              social: {
                label: "In-Person",
                color: "#3b82f6",
              },
              direct: {
                label: "Phone",
                color: "#06b6d4",
              },
            }}
            className="h-32 sm:h-40 md:h-48 mx-auto"
          >
            <RadialBarChart
              data={chartData}
              innerRadius="30%"
              outerRadius="80%"
              barSize={8}
              startAngle={180}
              endAngle={-180}
            >
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <RadialBar dataKey="value" background={false} cornerRadius={30} />
            </RadialBarChart>
          </ChartContainer>

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="text-xl sm:text-2xl md:text-3xl font-bold">{totalRecords}</p>
          </div>
        </div>

        <div className="mt-2 space-y-1 sm:space-y-2 w-full max-w-xs mx-auto">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full" style={{ backgroundColor: item.fill }}></div>
                <span className="text-xs sm:text-sm text-gray-400">{item.name}</span>
              </div>
              <span className="text-xs sm:text-sm font-medium">{item.value.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
