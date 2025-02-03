import React from 'react';
import { useTranslations } from 'next-intl';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatsCardSpline from '../stats-spline-card';

// Sample data 
const financialData = [
  { month: 'Jan', revenue: 45000, expenses: 32000, profit: 13000 },
  { month: 'Feb', revenue: 52000, expenses: 34000, profit: 18000 },
  { month: 'Mar', revenue: 48000, expenses: 31000, profit: 17000 },
  { month: 'Apr', revenue: 61000, expenses: 35000, profit: 26000 },
  { month: 'May', revenue: 55000, expenses: 33000, profit: 22000 },
  { month: 'Jun', revenue: 67000, expenses: 36000, profit: 31000 }
];

const bookingMethodsData = [
  { method: 'Website', bookings: 450 },
  { method: 'Mobile App', bookings: 380 },
  { method: 'Phone', bookings: 200 },
  { method: 'Walk-in', bookings: 150 },
  { method: 'Third Party', bookings: 220 }
];



interface StatCardProps {
title: string;
value: number;
trend: 'up' | 'down';
trendValue: number;
}

export default function Analytics() {
  const t = useTranslations('Analytics'); // Hook to get translations
  const currentMonthData = financialData[financialData.length - 1];
  const previousMonthData = financialData[financialData.length - 2];
  const  stats = [
    { label: t('numberOfBookings'), value: "28,345" },
    { label: t('totalExpenses'), value: "120", trend: { type: "increase" as "increase", value: "12" } },
    { label: t('totalRevenue'), value: "89", trend: { type: "increase" as "increase", value: "12" } },
    { label: t('totalProfit'), value: "46%", trend: { type: "decrease" as "decrease", value: "2" } },
  ]
  
  const calculateTrend = (current: number, previous: number): string => {
    return ((current - previous) / previous * 100).toFixed(1);
  };

  return (
    <div className="p-6 w-full space-y-6">
      <h2 className="text-2xl font-bold mb-6">{t('financialAnalytics')}</h2>
      
      {/* Stat Cards */}
      <StatsCardSpline stats={stats}/>

      {/* Financial Metrics Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t('financialOverview')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={financialData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#4F46E5" name={t('revenue')} strokeWidth={2} />
                <Line type="monotone" dataKey="expenses" stroke="#EF4444" name={t('expenses')} strokeWidth={2} />
                <Line type="monotone" dataKey="profit" stroke="#10B981" name={t('profit')} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Booking Methods Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t('bookingMethodsDistribution')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingMethodsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="method" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="bookings" fill="#6366F1" name={t('numberOfBookings')} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
