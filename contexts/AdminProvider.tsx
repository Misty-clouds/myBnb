"use client"

import { createContext, type ReactNode, useContext, useState } from "react"

interface AdminDetails {
  id: number
  created_at: string
  email: string
  company_uid: string[] | null
  photo_url: string | null
}

interface IContextState {
  admin: AdminDetails[]
  isLoading: boolean
  error: string | null
}

interface IAdminContext extends IContextState {
  // Function to update the global state
  setAdminState: ({ key, value }: { key: keyof IContextState; value: any }) => void
  // Helper function to update a specific admin property
  updateAdminProperty: (property: keyof AdminDetails, value: any) => void
  // Reset admin state
  resetAdmin: () => void
}

const AdminContext = createContext<IAdminContext | null>(null)

// Custom hook for consuming the context
export const useAdminContext = () => {
  const context = useContext(AdminContext)
  if (!context) throw new Error("useAdminContext must be used within an AdminProvider")
  return context
}

const initialState: IContextState = {
  admin: [
    {
      company_uid: [],
      created_at: "",
      email: "",
      id: 0,
      photo_url: null,
    },
  ],
  isLoading: false,
  error: null,
}

const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<IContextState>(initialState)

  // Function to update state
  const setAdminState = ({ key, value }: { key: keyof IContextState; value: any }) => {
    setState((prev) => ({ ...prev, [key]: value }))
  }

  // Helper function to update a specific admin property
  const updateAdminProperty = (property: keyof AdminDetails, value: any) => {
    setState((prev) => ({
      ...prev,
      admin: prev.admin.map((adminItem, index) => (index === 0 ? { ...adminItem, [property]: value } : adminItem)),
    }))
  }

  // Reset admin state
  const resetAdmin = () => {
    setState(initialState)
  }

  return (
    <AdminContext.Provider
      value={{
        ...state,
        setAdminState,
        updateAdminProperty,
        resetAdmin,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export default AdminProvider

