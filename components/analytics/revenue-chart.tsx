"use client"

import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
import { Area, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getRevenueAndExpenses } from "@/helper-functions"

// Default chart data for initial animation
const defaultData = [
  { month: "Jan", revenue: 0, expenses: 0 },
  { month: "Feb", revenue: 0, expenses: 0 },
  { month: "Mar", revenue: 0, expenses: 0 },
  { month: "Apr", revenue: 0, expenses: 0 },
  { month: "May", revenue: 0, expenses: 0 },
  { month: "Jun", revenue: 0, expenses: 0 },
  { month: "Jul", revenue: 0, expenses: 0 },
  { month: "Aug", revenue: 0, expenses: 0 },
  { month: "Sep", revenue: 0, expenses: 0 },
  { month: "Oct", revenue: 0, expenses: 0 },
  { month: "Nov", revenue: 0, expenses: 0 },
  { month: "Dec", revenue: 0, expenses: 0 },
]

// Function to format numbers as currency
const formatCurrency = (value: number) => {
  return value >= 1000 ? `${Math.floor(value / 1000)}K` : value.toString()
}

export default function RevenueChart({ company_id }: { company_id: string }) {
  const [chartData, setChartData] = useState(defaultData)
  const [chartRange, setChartRange] = useState({ max: 250000, ticks: [0, 50000, 100000, 150000, 200000, 250000] })

  useEffect(() => {
    const fetchData = async () => {
      const result = await getRevenueAndExpenses(company_id)

      if (!result) {
        // If API fails, retain the default data
        return
      }

      // Check if all revenue values are 0
      const allZero = result.every((entry: any) => entry.revenue === 0 && entry.expenses === 0)

      if (allZero) {
        // Show default data for animation, then update to 0 after a delay
        setChartData(defaultData)
        setTimeout(() => {
          setChartData(result)
          updateChartRange(result)
        }, 1500) // Delay of 1.5s
      } else {
        setChartData(result)
        updateChartRange(result)
      }
    }

    fetchData()
  }, [company_id])

  // Function to determine appropriate chart range based on data
  const updateChartRange = (data: any[]) => {
    // Calculate maximum revenue and expenses
    const maxRevenue = Math.max(...data.map(item => item.revenue))
    const maxExpenses = Math.max(...data.map(item => item.expenses))
    const maxValue = Math.max(maxRevenue, maxExpenses)
    
    // Determine the appropriate upper limit and ticks
    let max, ticks
    
    if (maxValue <= 10000) {
      max = 10000
      ticks = [0, 2000, 4000, 6000, 8000, 10000]
    } else if (maxValue <= 50000) {
      max = 50000
      ticks = [0, 10000, 20000, 30000, 40000, 50000]
    } else if (maxValue <= 100000) {
      max = 100000
      ticks = [0, 20000, 40000, 60000, 80000, 100000]
    } else if (maxValue <= 250000) {
      max = 250000
      ticks = [0, 50000, 100000, 150000, 200000, 250000]
    } else if (maxValue <= 500000) {
      max = 500000
      ticks = [0, 100000, 200000, 300000, 400000, 500000]
    } else {
      // For very large values, round up to the nearest million
      const roundedMax = Math.ceil(maxValue / 1000000) * 1000000
      max = roundedMax
      ticks = [0, roundedMax * 0.2, roundedMax * 0.4, roundedMax * 0.6, roundedMax * 0.8, roundedMax]
    }
    
    setChartRange({ max, ticks })
  }

  const currentRevenue = chartData[chartData.length - 1]?.revenue || 0
  const previousRevenue = chartData[chartData.length - 2]?.revenue || 0
  const percentageChange =
    previousRevenue !== 0 ? (((currentRevenue - previousRevenue) / previousRevenue) * 100).toFixed(1) : "0"
  const totalRevenue = (chartData.reduce((acc, entry) => acc + entry.revenue, 0) / 1000).toFixed(1)
  const formatedCurrency = (amount: number) => {
    if (amount >= 1000) {
      return ((amount / 1000) + 'k')
    }
    return amount
  }

  const formatedTotalRevenue = formatCurrency(parseInt(totalRevenue))

  return (
    <Card className="w-full h-full border-none rounded-xl overflow-hidden flex flex-col">
      <CardHeader className="pb-0 pt-4">
        <div className="space-y-1">
          <CardTitle className="text-xs sm:text-sm font-normal text-gray-400">Total revenue</CardTitle>
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-xl sm:text-2xl md:text-3xl font-semibold">
              SAR{totalRevenue}K
            </span>
          
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col">
        <div className="flex items-center justify-end px-2 sm:px-4 md:px-6 py-1 gap-2 sm:gap-4 md:gap-6 flex-wrap">
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="h-2 w-2 rounded-full bg-primary-500"></div>
            <span className="text-xs text-gray-400">Revenue</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="h-2 w-2 rounded-full bg-cyan-400"></div>
            <span className="text-xs text-gray-400">Expenses</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-6 md:h-7 text-xs bg-transparent border-gray-700 text-gray-400 gap-1"
          >
            Jan 2024 - Dec 2024
          </Button>
        </div>
        <div className="flex-1 min-h-32 sm:min-h-48 md:min-h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d946ef" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#d946ef" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#1e293b" strokeDasharray="3 3" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 10 }} height={20} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 10 }}
                tickFormatter={formatCurrency}
                domain={[0, chartRange.max]}
                ticks={chartRange.ticks}
                width={40}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", color: "#f8fafc" }}
                formatter={(value: number) => [`$${(value / 1000).toFixed(1)}K`, ""]}
                labelFormatter={(label) => `${label} 2024`}
              />
              <Line type="monotone" dataKey="revenue" stroke="#d946ef" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "#d946ef", stroke: "#0f172a", strokeWidth: 2 }} />
              <Line type="monotone" dataKey="expenses" stroke="#06b6d4" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "#06b6d4", stroke: "#0f172a", strokeWidth: 2 }} />
              <Area type="monotone" dataKey="revenue" fill="url(#colorRevenue)" stroke="transparent" />
              <Area type="monotone" dataKey="expenses" fill="url(#colorExpenses)" stroke="transparent" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}