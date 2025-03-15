"use client"

import { createContext, type ReactNode, useContext, useState, useEffect } from "react"
import { useUser as useAuthUser } from "@/helper-functions"

// Define User interface
interface User {
  id: string
  email: string
  name?: string
  avatar?: string
  // Add any other user properties you need
}

// Define the structure of the context state
interface IUserContextState {
  user: User | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
}

// Define the context interface
interface IUserContext extends IUserContextState {
  setUserState: ({ key, value }: { key: keyof IUserContextState; value: any }) => void
  updateUser: (userData: Partial<User>) => void
  logout: () => void
}

// Create the context
const UserContext = createContext<IUserContext | null>(null)

// Custom hook for consuming the context
export const useUserContext = () => {
  const context = useContext(UserContext)
  if (!context) throw new Error("useUserContext must be used within a UserProvider")
  return context
}

// Initial state
const initialState: IUserContextState = {
  user: null,
  isLoading: true,
  error: null,
  isAuthenticated: false,
}

// Provider Component
const UserProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<IUserContextState>(initialState)

  // Use the original useUser hook to get authentication data
  const authUser = useAuthUser()

  // Function to update state
  const setUserState = ({ key, value }: { key: keyof IUserContextState; value: any }) => {
    setState((prev) => ({ ...prev, [key]: value }))
  }

  // Helper function to update user data
  const updateUser = (userData: Partial<User>) => {
    setState((prev) => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...userData } : (userData as User),
    }))
  }

  // Logout function
  const logout = () => {
    setState(initialState)
    // Add any additional logout logic here if needed
  }

  // Effect to sync with auth user data
  useEffect(() => {
    if (authUser) {
      updateUser({
        id: authUser.id as string,
        email: authUser.email as string,
        name: authUser.email ? authUser.email.split("@")[0] : undefined,
        // You can add more user properties here
      })

      setUserState({ key: "isAuthenticated", value: true })
    }

    setUserState({ key: "isLoading", value: false })
  }, [authUser])

  return (
    <UserContext.Provider
      value={{
        ...state,
        setUserState,
        updateUser,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider

