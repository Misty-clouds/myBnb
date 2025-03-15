"use client"

import React from "react"

import { createContext, type ReactNode, useContext, useState, useEffect, useCallback } from "react"

// Define Company interface to match CompanyDetails from your API
interface Company {
  id: number
  name: string
  logo: string
  plan: string
  // Add any other company properties you need
}

// Define the structure of the context state
interface ICompanyContextState {
  companies: Company[]
  currentCompanyId: number | null
  activeCompany: Company | null
  isLoading: boolean
  error: string | null
}

// Define the context interface
interface ICompanyContext extends ICompanyContextState {
  setCompanyState: ({ key, value }: { key: keyof ICompanyContextState; value: any }) => void
  setCurrentCompanyId: (id: number | null) => void
  setCompanies: (companies: Company[]) => void
  setActiveCompany: (company: Company | null) => void
}

// Create the context
const CompanyContext = createContext<ICompanyContext | null>(null)

// Custom hook for consuming the context
export const useCompanyContext = () => {
  const context = useContext(CompanyContext)
  if (!context) throw new Error("useCompanyContext must be used within a CompanyProvider")
  return context
}

// Initial state
const initialState: ICompanyContextState = {
  companies: [],
  currentCompanyId: null,
  activeCompany: null,
  isLoading: false,
  error: null,
}

// Provider Component
const CompanyProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ICompanyContextState>(() => {
    // Try to load state from localStorage on client side
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("companyState")
      if (savedState) {
        try {
          return JSON.parse(savedState)
        } catch (e) {
          console.error("Failed to parse saved company state", e)
        }
      }
    }
    return initialState
  })

  // Function to update state - use useCallback to prevent recreation on each render
  const setCompanyState = useCallback(({ key, value }: { key: keyof ICompanyContextState; value: any }) => {
    setState((prev) => ({ ...prev, [key]: value }))
  }, [])

  // Helper function to set current company ID
  const setCurrentCompanyId = useCallback((id: number | null) => {
    setState((prev) => ({ ...prev, currentCompanyId: id }))
  }, [])

  // Helper function to set companies
  const setCompanies = useCallback((companies: Company[]) => {
    setState((prev) => ({ ...prev, companies }))
  }, [])

  // Helper function to set active company
  const setActiveCompany = useCallback((company: Company | null) => {
    setState((prev) => ({ ...prev, activeCompany: company }))
  }, [])

  // Persist state to localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("companyState", JSON.stringify(state))
    }
  }, [state])

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(
    () => ({
      ...state,
      setCompanyState,
      setCurrentCompanyId,
      setCompanies,
      setActiveCompany,
    }),
    [state, setCompanyState, setCurrentCompanyId, setCompanies, setActiveCompany],
  )

  return <CompanyContext.Provider value={contextValue}>{children}</CompanyContext.Provider>
}

export default CompanyProvider

