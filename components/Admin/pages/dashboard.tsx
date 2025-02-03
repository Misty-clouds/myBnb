import { StatsCard } from "../stats-card";
import { useState, useEffect } from "react";
import { useTranslations } from 'next-intl';
import { Booking } from "./tab/@booking";

interface NavItem {
  id: string;
  label: string;
}

export function DashboardPage() {
  const t = useTranslations('Dashboard');
  const [selectedPage, setSelectedPage] = useState<NavItem['id']>('booking');
  const navItems: NavItem[] = [
    { id: 'booking', label: t('booking') }
  ];

  const getPageContent = () => {
    if (selectedPage === 'booking') {
      return <Booking />;
    }
  };

  return (
    <main className="flex-1 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary-text">{t('title')}</h1>
        <p className="text-muted-gray">{t('welcome')}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-sm font-medium text-muted-gray mb-4">{t('statsOverview')}</h2>
        <div className="grid grid-cols-4 gap-8">
          <StatsCard label={t('numberOfBookings')} value="28,345" />
          <StatsCard label={t('totalExpenses')} value="120" trend={{ type: "increase", value: "12" }} />
          <StatsCard label={t('totalRevenue')} value="89" trend={{ type: "increase", value: "12" }} />
          <StatsCard label={t('totalProfit')} value="46%" trend={{ type: "decrease", value: "2" }} />
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        {navItems.map((navItem) => (
          <button
            onClick={() => setSelectedPage(navItem.id)}
            key={navItem.id}
            className={`$ {
              selectedPage === navItem.id? 'px-4 py-2 text-primary-text font-medium border-b-2 border-primary transition-colors duration-200': 'px-4 py-2 text-muted-gray hover:text-primary-text transition-colors duration-200'
            }`}
          >
            {navItem.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">{getPageContent()}</div>
    </main>
  );
}