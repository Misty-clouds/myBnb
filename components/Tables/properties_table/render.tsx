"use client"

import { useEffect, useState, useCallback } from "react"
import { columns } from "./columns"
import { DataTableWithVisibility } from "./data_table"
import type { PropertiesDetails } from "@/types"
import { getPropertiesDetails } from "@/helper-functions"

export default function PropertiesTable({
  id,
  status,
  limit,
  company_id,
  created_by,
}: {
  id: string
  status?: string
  limit?: number
  company_id?: string
  created_by?: string
}) {
  const [data, setData] = useState<PropertiesDetails[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshCounter, setRefreshCounter] = useState<number>(0)

  const fetchData = useCallback(async () => {
    if (!id) return

    try {
      setLoading(true)

      const properties = await getPropertiesDetails(id, status, limit, company_id, created_by)
      setData(properties)
    } catch (err) {
      setError("Failed to load property details")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [id, status, limit, company_id, created_by])

  // Initial data fetch
  useEffect(() => {
    fetchData()
  }, [fetchData, refreshCounter])

  // Listen for the custom property-added event
  useEffect(() => {
    const handlePropertyAdded = () => {
      // Increment the refresh counter to trigger a re-fetch
      setRefreshCounter((prev) => prev + 1)
    }

    document.addEventListener("property-added", handlePropertyAdded)

    return () => {
      document.removeEventListener("property-added", handlePropertyAdded)
    }
  }, [])

  if (!id) {
    return <p>ID is required</p>
  }

  if (loading) {
    return <p>Loading property data...</p>
  }

  if (error) {
    return <p className="text-red-500">{error}</p>
  }

  return (
    <div data-table-component>
      <DataTableWithVisibility columns={columns(fetchData)} data={data}/>
    </div>
  )
}

