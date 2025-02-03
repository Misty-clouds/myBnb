import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { BookingItems } from "../booking-items";
import MonthCardSpline from "@/components/Admin/forms/month-card";
import { YearSelector } from "../forms/year-selector";
import { useYearStore } from "../forms/year-selector";
import BookingForm from "../forms/booking-form";

interface Booking {
  id: number;
  customerName: string;
  entryDate: string;
  exitDate: string;
  dailyAmount: number;
  numberOfDays: number;
  totalAmount: number;
  bookingMethod: string;
  receiptImage: string;
}

interface BookingWithActions extends Booking {
  actions: boolean;
}

export default function BookingPage() {
  const t = useTranslations('Booking'); 
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const selectedYear = useYearStore((state) => state.selectedYear);
  const currentMonthIndex = new Date().getMonth();
  const [activeMonth, setActiveMonth] = useState<number>(currentMonthIndex);

  const [bookings, setBookings] = useState<BookingWithActions[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getFirstDayOfMonth = (date: Date): string => {
    return new Date(date.getFullYear(), date.getMonth(), 1)
      .toISOString()
      .split('T')[0];
  };

  const getLastDayOfMonth = (date: Date): string => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0)
      .toISOString()
      .split('T')[0];
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const targetDate = new Date(selectedYear, activeMonth);
        const firstDayOfMonth = getFirstDayOfMonth(targetDate);
        const lastDayOfMonth = getLastDayOfMonth(targetDate);

        console.log(`Fetching bookings from ${firstDayOfMonth} to ${lastDayOfMonth}`);

        const apiUrl = `/api/bookings?startDate=${firstDayOfMonth}&endDate=${lastDayOfMonth}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }

        const data: Booking[] = await response.json();

        const bookingsWithActions: BookingWithActions[] = data.map((booking) => ({
          ...booking,
          actions: true,
        }));

        setBookings(bookingsWithActions);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [activeMonth, selectedYear]);

  return (
    <main className="flex-1 p-8">
      <div className="justify-between flex">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary-text">{t('booking')}</h1>
        </div>
        <button 
          onClick={() => setIsBookingFormOpen(true)}
          className="bg-accent text-white font-semibold px-3 rounded-xl transition-all duration-300
                    hover:bg-accent-hover hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
        >
          {t('addReservation')}
        </button>

        <BookingForm
        isOpen={isBookingFormOpen}
        onClose={() => setIsBookingFormOpen(false)}
        onSubmit={async (bookingData) => {
        try {
        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingData),
        });

        if (!response.ok) {
          throw new Error('Failed to create booking');
        }
        } catch (error) {
        console.error('Error creating booking:', error);
        }
        }}
        />
      </div>

      <div className="mb-8">
        <h2 className="text-sm font-medium text-muted-gray mb-4">
          {t('trackRecords')}
        </h2>
        <div className="flex justify-end">
          <YearSelector />
        </div>

        <div className="overflow-x-auto scrollbar-hide flex gap-4 py-2">
          <MonthCardSpline 
            activeMonth={activeMonth} 
            onMonthChange={setActiveMonth} 
            year={selectedYear}
          />
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <button className="px-4 py-2 text-primary-text font-medium border-b-2 border-primary transition-colors duration-200">
          {t('bookingRecords')}
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-gray-600">{t('loadingBookings')}</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-red-500">{t('error')}: {error}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <BookingItems bookings={bookings} />
        </div>
      )}
    </main>
  );
}
