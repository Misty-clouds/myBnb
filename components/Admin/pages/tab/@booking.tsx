import { useEffect, useState } from 'react';
import { BookingItems } from '../../booking-items';




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

  interface BookingItemsProps {
    bookings: BookingWithActions[];
  }

export function Booking() {

  
    const [bookings, setBookings] = useState<BookingWithActions[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

     //  Function to get the first day of the month
        const getFirstDayOfMonth = (date: Date): string => {
          return new Date(date.getFullYear(), date.getMonth(), 1)
            .toISOString()
            .split('T')[0]; // Format: YYYY-MM-DD
        };

        //  Function to get the last day of the month
        const getLastDayOfMonth = (date: Date): string => {
          return new Date(date.getFullYear(), date.getMonth() + 1, 0)
            .toISOString()
            .split('T')[0]; // Format: YYYY-MM-DD
        };
  
    useEffect(() => {
      const fetchBookings = async () => {
        try {
          // Calculate start and end dates for the current month
          const currentDate = new Date();
          const firstDayOfMonth = getFirstDayOfMonth(currentDate);
          const lastDayOfMonth = getLastDayOfMonth(currentDate);
  
          console.log(`Fetching bookings from ${firstDayOfMonth} to ${lastDayOfMonth}`);

          const BASE_URL ='http://localhost:3000'
          const apiUrl = `/api/bookings?startDate=${firstDayOfMonth}&endDate=${lastDayOfMonth}`;

  
          // Fetch bookings for the current month
          const response = await fetch(apiUrl);
  
          if (!response.ok) {
            throw new Error('Failed to fetch bookings');
          }
  
          const data: Booking[] = await response.json();
  
          // Add actions field to each booking
          const bookingsWithActions: BookingWithActions[] = data.map((booking) => ({
            ...booking,
            actions: false,
          }));
  
          setBookings(bookingsWithActions);
          setIsLoading(false);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
          setIsLoading(false);
        }
      };
  
      fetchBookings();
    }, []);
  
    if (isLoading) {
      return (
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-red-500">Error: {error}</p>
        </div>
      );
    }
  
    return (
      <div className="max-w-screen-md">
        <BookingItems bookings={bookings} />
      </div>
    );
  }
  
  