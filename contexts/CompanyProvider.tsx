"use client"

import React from "react"

import { createContext, type ReactNode, useContext, useState, useEffect, useCallback } from "react"

interface Company {
  uid:string
  name: string
  logo: string
  plan: string
}

interface ICompanyContextState {
  companies: Company[]
  currentCompanyId: string | null
  activeCompany: Company | null
  isLoading: boolean
  error: string | null
}

interface ICompanyContext extends ICompanyContextState {
  setCompanyState: ({ key, value }: { key: keyof ICompanyContextState; value: any }) => void
  setCurrentCompanyId: (uid: string | null) => void
  setCompanies: (companies: Company[]) => void
  setActiveCompany: (company: Company | null) => void
}

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

  const setCompanyState = useCallback(({ key, value }: { key: keyof ICompanyContextState; value: any }) => {
    setState((prev) => ({ ...prev, [key]: value }))
  }, [])

  const setCurrentCompanyId = useCallback((uid: string | null) => {
    setState((prev) => ({ ...prev, currentCompanyId: uid }))
  }, [])

  const setCompanies = useCallback((companies: Company[]) => {
    setState((prev) => ({ ...prev, companies }))
  }, [])

  const setActiveCompany = useCallback((company: Company | null) => {
    setState((prev) => ({ ...prev, activeCompany: company }))
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("companyState", JSON.stringify(state))
    }
  }, [state])

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

