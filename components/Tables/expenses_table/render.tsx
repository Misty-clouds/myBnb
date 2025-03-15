"use client"

import { useEffect, useState, useCallback } from "react"
import { columns } from "./columns"
import { DataTableWithVisibility } from "./data_table"
import type { ExpensesDetails } from "@/types"
import { getExpensesDetails } from "@/helper-functions"

export default function ExpensesTable({
  company_id,
  startDate,
  endDate,
}: {
  company_id?: string
  startDate?: string
  endDate?: string
}) {
  const [data, setData] = useState<ExpensesDetails[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshCounter, setRefreshCounter] = useState<number>(0)

  const fetchData = useCallback(async () => {

    try {
      setLoading(true)

      const expenses = await getExpensesDetails( startDate, endDate, company_id)
      setData(expenses)
    } catch (err) {
      setError("Failed to load expense details")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [ startDate, endDate, company_id])

  // Initial data fetch
  useEffect(() => {
    fetchData()
  }, [fetchData, refreshCounter])

  // Listen for the custom expense-added event
  useEffect(() => {
    const handleExpenseAdded = () => {
      // Increment the refresh counter to trigger a re-fetch
      setRefreshCounter((prev) => prev + 1)
    }

    document.addEventListener("expense-added", handleExpenseAdded)

    return () => {
      document.removeEventListener("expense-added", handleExpenseAdded)
    }
  }, [])



  if (loading) {
    return <p>Loading expense data...</p>
  }

  if (error) {
    return <p className="text-red-500">{error}</p>
  }

  return (
    <div data-table-component>
      <DataTableWithVisibility columns={columns(fetchData)} data={data}  />
    </div>
  )
}

