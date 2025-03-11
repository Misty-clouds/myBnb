"use client"

import { useEffect, useState, useCallback } from "react"
import { columns } from "./columns"
import { DataTableWithVisibility } from "./data_table"
import type { BookingDetails } from "@/types"
import { getBookingDetails } from "@/helper-functions"

export default function Table({
  company_id,
  startDate,
  endDate,
}: { company_id: string; startDate: string; endDate: string }) {
  const [data, setData] = useState<BookingDetails[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState<number>(1)
  const [refreshCounter, setRefreshCounter] = useState<number>(0)

  const fetchData = useCallback(async () => {
    if (!company_id) return

    try {
      setLoading(true)

      const result = await getBookingDetails(company_id, String(startDate), String(endDate))
      const bookings = result.data
      setData(bookings)
    } catch (err) {
      setError("Failed to load booking details")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [company_id, startDate, endDate])

  // Initial data fetch
  useEffect(() => {
    fetchData()
  }, [fetchData, refreshCounter]) // Add refreshCounter to dependencies

  // Listen for the custom booking-added event
  useEffect(() => {
    const handleBookingAdded = () => {
      // Increment the refresh counter to trigger a re-fetch
      setRefreshCounter((prev) => prev + 1)
    }

    document.addEventListener("booking-added", handleBookingAdded)

    return () => {
      document.removeEventListener("booking-added", handleBookingAdded)
    }
  }, [])

  if (!company_id) {
    return <p>Company ID is required</p>
  }

  return (
    <div data-table-component>
      <DataTableWithVisibility columns={columns(fetchData)} data={data} />
    </div>
  )
}

