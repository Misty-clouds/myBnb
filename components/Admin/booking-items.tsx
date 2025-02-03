import { useTranslations } from 'next-intl';
import { BookingItem } from "./booking-item"

interface BookingItemProps {
  id: number
  customerName: string
  entryDate: string
  exitDate: string
  dailyAmount: number
  numberOfDays: number
  totalAmount: number
  bookingMethod: string
  receiptImage?: string
  actions?: boolean
}

export function BookingItems({ bookings }: { bookings: BookingItemProps[] }) {
  const t = useTranslations("BookingItems"); // Hook to get translations


  // In your parent component:
const handleUpdate = async (id: number, data: any) => {
  try {
    const response = await fetch(`/api/booking/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) throw new Error('Failed to update booking');
    
    // Refresh your bookings list or update local state
  } catch (error) {
    console.error('Error updating booking:', error);
  }
};

const handleDelete = async (id: number) => {
  try {
    const response = await fetch(`/api/booking/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) throw new Error('Failed to delete booking');
    
    // Refresh your bookings list or update local state
  } catch (error) {
    console.error('Error deleting booking:', error);
  }
};

// Then pass these handlers to your BookingItem component:

  return (
    <div className="space-y-4">
      <div className="hidden md:grid grid-cols-5 lg:grid-cols-8 gap-4 px-1 py-4 bg-background rounded-lg align-middle font-sm text-muted-gray">
        <div className="md:col-span-2">{t('customer')}</div>
        <div className="text-sm">{t('entryDate')}</div>
        <div>{t('exitDate')}</div>
        <div className="text-sm">{t('dailyAmount')}</div>
        <div>{t('days')}</div>
        <div className="text-dm">{t('totalAmount')}</div>
        <div>{t('actions')}</div>
      </div>
      {bookings.map((booking, index) => (
        <BookingItem key={index} {...booking}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
         />
      ))}
    </div>
  )
}
