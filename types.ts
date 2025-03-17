export interface User {
  id: string;
  email: string;
}

export interface AdminDetails {
  id: number;
  created_at: string;
  email: string;
  company_uid: string[]|null; 
  photo_url: string|null;
  uid:string;
};

export interface BookingDetails {
  id: number;
  entryDate?: string;
  exitDate?: string;
  propertyId: number |null;
  customerName?:string;
  dailyAmount?:number;
  numberOfDays:number;
  totalAmount?:number;
  bookingMethod?:string;
  receiptImage?:string|null;
  created_at?:string;
  propertyName?:string;
  created_by?:string;
  company_uid:string;
}

export interface CompanyDetails {
  id: number;
  created_at: string;
  isSubscribed: boolean;
  subscription_start_date: string;
  subcription_end_date: string;
  admin_email: string;
  uid: string;
  managers_email:string[];
  name: string;
  logo:string;
  plan: string;
  payment_status:string;
  transaction_id:string;
}

export interface ExpensesDetails {
  id: string;
  amount: number;
  date: string;
  company_id: string;
  created_by?: string;
  description?: string;
  receiptImage?: string;
  field?: string;
  company_uid:string;
}

export interface PropertiesDetails {
  created_at: string;
  company_id: string;
  company_uid:string;
  id: string;
  status?: string;
  image?: string | null;
  created_by?: string;
  name: string;
  location?: string;
}


export interface StatsCardProps {
  label: string;
  value: string | number;
  trend?: {
    type:string;
    value: string;
  };
}

export interface StatsCardGroupProps {
    stats: StatsCardProps[];
  }


  export interface GetBookingStats {
    number_of_bookings: number;
    total_revenue: number;
    total_expenses: number;
    total_profit: number;
    number_of_bookings_change: number | null;
    number_of_bookings_trend: 'increase' | 'decrease' | 'no change';
    total_revenue_change: number | null;
    total_revenue_trend: 'increase' | 'decrease' | 'no change';
    total_expenses_change: number | null;
    total_expenses_trend: 'increase' | 'decrease' | 'no change';
    total_profit_change: number | null;
    total_profit_trend: 'increase' | 'decrease' | 'no change';
  }
  

  export interface BookingDetailsResponse {
    totalRecords: number;
    bookingCounts: {
        online: number;
        phone: number;
        "in-person": number;
    };
    percentage: {
        online: number;
        phone: number;
        "in-person": number;
    };
}