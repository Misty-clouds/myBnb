"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import {
  AdminDetails,
  BookingDetails,
  CompanyDetails,
  ExpensesDetails,
  PropertiesDetails,
  GetBookingStats,
  BookingDetailsResponse,
} from "@/types";

//function to get user auth details
export function useUser() {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user?.id);
        setUserEmail(user?.email ?? null);
      }
    };

    getUser();
  }, []);

  return {
    id: userId,
    email: userEmail,
  };
}

export async function getAdminDetails(id: string): Promise<AdminDetails> {
  const response = await fetch(`/api/admin/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch user details for ID: ${id}`);
  }

  console.log('admin details response ',{ response });
  const data = await response.json();
  console.log("Raw API response:", data);

 

  return data;
}

export async function updateAdminDetails(
  id: string,
  updates: Partial<AdminDetails>
): Promise<AdminDetails> {
  const response = await fetch(`/api/admin/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error(`Failed to update user details for ID: ${id}`);
  }

  return await response.json();
}

export async function deleteAdminDetails(id: string): Promise<void> {
  const response = await fetch(`/api/admin/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete user details for ID: ${id}`);
  }
}

export async function insertAdminDetails(
  details: Partial<AdminDetails>
): Promise<AdminDetails> {
  const response = await fetch(`/api/admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(details),
  });

  if (!response.ok) {
    throw new Error(`Failed to insert user details`);
  }

  return await response.json();
}

//booking details  (This gives  all the functions to interact with the booking table )
export async function updateBookingDetails(
  id: string,
  updates: Partial<BookingDetails>
): Promise<BookingDetails> {
  const response = await fetch(`/api/bookings/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error(`Failed to update booking details for ID: ${id}`);
  }

  return await response.json();
}

export async function deleteBookingDetails(id: string): Promise<void> {
  const response = await fetch(`/api/bookings/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete booking details for ID: ${id}`);
  }
}

export async function insertBookingDetails(
  details: Partial<BookingDetails>
): Promise<BookingDetails> {
  const response = await fetch(`/api/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(details),
  });

  if (!response.ok) {
    throw new Error(`Failed to insert booking details`);
  }

  return await response.json();
}

export async function getBookingDetails(
  company_id: string,
  startDate?: string,
  endDate?: string
): Promise<{ data: BookingDetails[] }> {
  const url = `/api/bookings/${company_id}?startDate=${startDate}&endDate=${endDate}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch booking details for ID: ${company_id}`);
  }

  const { data } = await response.json();

  return {
    data: data.map((booking: any) => ({
      id: booking.id,
      entryDate: booking.entryDate,
      exitDate: booking.exitDate,
      propertyId: booking.propertyId,
      customerName: booking.customerName,
      dailyAmount: booking.dailyAmount,
      numberOfDays: booking.numberOfDays,
      totalAmount: booking.totalAmount,
      bookingMethod: booking.bookingMethod,
      receiptImage: booking.receiptImage || null,
      date: booking.created_at || null,
      propertyName: booking.propertyName || null,
      created_by: booking.created_by || null,
      company_id: booking.company_uid || null,
    })),
  };
}

//company details (This gives  all the functions to interact with the company_name table )

export async function updateCompanyDetails(
  id: string,
  updates: Partial<CompanyDetails>
): Promise<CompanyDetails> {
  const response = await fetch(`/api/company_name/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error(`Failed to update company details for ID: ${id}`);
  }

  return await response.json();
}

export async function deleteCompanyDetails(id: string): Promise<void> {
  const response = await fetch(`/api/company_name/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete company details for ID: ${id}`);
  }
}

export async function insertCompanyDetails(
  details: Partial<CompanyDetails>
): Promise<CompanyDetails> {
  const response = await fetch(`/api/company_name`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(details),
  });

  if (!response.ok) {
    throw new Error(`Failed to insert company details`);
  }

  return await response.json();
}

export async function getCompanyDetails(id: string): Promise<CompanyDetails> {
  const response = await fetch(`/api/company_name/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch company details for ID: ${id}`);
  }

  const data = await response.json();

  return {
    id: data.id,
    name: data.name,
    created_at: data.created_at,
    isSubscribed: data.isSubscribed,
    subscription_start_date: data.subscription_start_date,
    subcription_end_date: data.subcription_end_date,
    admin_email: data.admin_email,
    logo: data.logo,
    uid: data.uid,
    plan: data.plan,
    managers_email: Array.isArray(data.managers_email)
      ? data.managers_email
      : [], 
    payment_status:data.payment_status,
    transaction_id:data.transaction_id
  };
}

//expenses details (This gives  all the functions to interact with the expenses table )

export async function updateExpensesDetails(
  id: string,
  updates: Partial<ExpensesDetails>
): Promise<ExpensesDetails> {
  const response = await fetch(`/api/expenses/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error(`Failed to update expenses details for ID: ${id}`);
  }

  return await response.json();
}

export async function deleteExpensesDetails(id: string): Promise<void> {
  const response = await fetch(`/api/expenses/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete expenses details for ID: ${id}`);
  }
}

export async function insertExpensesDetails(
  details: Partial<ExpensesDetails>
): Promise<ExpensesDetails> {
  const response = await fetch(`/api/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(details),
  });

  if (!response.ok) {
    throw new Error(`Failed to insert expenses details`);
  }

  return await response.json();
}

export async function getExpensesDetails(
  startDate?: string,
  endDate?: string,
  company_id?: string
): Promise<ExpensesDetails[]> {
  // Append query parameters only if they exist
  const url = `/api/expenses/${company_id}?startDate=${startDate}&endDate=${endDate}`;

  const response = await fetch(url);

  const data = await response.json();

  // Ensure it handles an array of expenses correctly
  return data;
}

//properties details (This gives  all the functions to interact with the properties table )

export async function updatePropertiesDetails(
  id: string,
  updates: Partial<PropertiesDetails>
): Promise<PropertiesDetails> {
  const response = await fetch(`/api/properties/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error(`Failed to update properties details for ID: ${id}`);
  }

  return await response.json();
}

export async function deletePropertiesDetails(id: string): Promise<void> {
  const response = await fetch(`/api/properties/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete properties details for ID: ${id}`);
  }
}

export async function insertPropertiesDetails(
  details: Partial<PropertiesDetails>
): Promise<PropertiesDetails> {
  const response = await fetch(`/api/properties`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(details),
  });

  if (!response.ok) {
    throw new Error(`Failed to insert properties details`);
  }

  return await response.json();
}

export async function getPropertiesDetails(
  company_id: string,
  start_date:string,
  end_date:string
): Promise<PropertiesDetails[]> {
  // Construct query parameters dynamically
  const queryParams = new URLSearchParams();
  
  // Append query parameters only if they exist
  const url = `/api/properties/${company_id}?startDate=${start_date}&endDate=${end_date}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch properties details for ID: ${company_id}`);
  }

  const data = await response.json();

  return data.map((property: any) => ({
    created_at: property.created_at,
    company_id: property.company_id,
    id: property.id,
    status: property.status || null,
    image: property.image || null,
    created_by: property.created_by || null,
    name: property.name,
    location: property.location || null,
  }));
}

//function to get booking stats
export async function getBookingStats(
  company_id: string,
  start_date: string,
  end_date: string
): Promise<GetBookingStats> {
  const url = `/api/stats/?id=${company_id}&start_date=${start_date}&end_date=${end_date}`;

  try {
    const response = await fetch(url);

    // Handle errors
    if (!response.ok) {
      throw new Error(
        `Failed to fetch booking stats for range: ${start_date} - ${end_date}`
      );
    }

    // Parse and return JSON response
    const data: GetBookingStats = await response.json();

    // Return fake data if response is null or missing fields
    if (!data || data.number_of_bookings === undefined) {
      return {
        number_of_bookings: 0,
        total_revenue: 0,
        total_expenses: 0,
        total_profit: 0,
        number_of_bookings_change: 0,
        number_of_bookings_trend: "no change",
        total_revenue_change: 0,
        total_revenue_trend: "no change",
        total_expenses_change: 0,
        total_expenses_trend: "no change",
        total_profit_change: 0,
        total_profit_trend: "no change",
      };
    }

    return data;
  } catch (error) {
    console.error(error);

    // Return fake data in case of an error
    return {
      number_of_bookings: 0,
      total_revenue: 0,
      total_expenses: 0,
      total_profit: 0,
      number_of_bookings_change: 0,
      number_of_bookings_trend: "no change",
      total_revenue_change: 0,
      total_revenue_trend: "no change",
      total_expenses_change: 0,
      total_expenses_trend: "no change",
      total_profit_change: 0,
      total_profit_trend: "no change",
    };
  }
}

export async function getUserBookingDetails(
  companyId: string,
  startDate: string,
  endDate: string
): Promise<BookingDetailsResponse | null> {
  try {
    const response = await fetch(
      `/api/booking_details?id=${companyId}&startDate=${startDate}&endDate=${endDate}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error(`API request failed with status: ${response.status}`);
      return null;
    }

    const data: BookingDetailsResponse = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching booking details:", error);
    return null;
  }
}

export async function getRevenueAndExpenses(
  companyId: string
): Promise<{ month: string; revenue: number; expenses: number }[] | null> {
  const startDate = `${new Date().getFullYear()}-01-01`;
  const endDate = `${new Date().getFullYear()}-12-31`;
  try {
    const response = await fetch(
      `/api/revenue?id=${companyId}&startDate=${startDate}&endDate=${endDate}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error(`API request failed with status: ${response.status}`);
      return null;
    }

    const data: { month: string; revenue: number; expenses: number }[] =
      await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching revenue and expenses data:", error);
    return null;
  }
}

export const getAdminRecordById = async (userId: string) => {
  console.log(`Fetching admin record for user ID: ${userId}`);
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_admin_record_by_id", {
    user_id: userId,
  });

  if (error) {
    console.error("Error fetching admin record:", error);
    return null;
  }

  console.log("Admin record data supabase:", data);
  return data;
};



export async function updateCompanyPaymentStatus(
  companyId: string,
  status: "paid" | "failed" | "pending",
  transactionId?: string,
) {
  try {
   
    const response = await fetch(`/api/companies/${companyId}/payment-status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payment_status: status,
        transaction_id: transactionId,
      }),
    });

    return response.json();

    console.log(`Updating company ${companyId} payment status to ${status} with transaction ${transactionId}`)
    return Promise.resolve()
  } catch (error) {
    console.error("Error updating company payment status:", error)
    throw error
  }
}