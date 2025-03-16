"use client"

import type React from "react"
import { useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { getAdminDetails, getCompanyDetails } from "@/helper-functions"
import { useCompanyContext } from "@/contexts/CompanyProvider"
import { useAdminContext } from "@/contexts/AdminProvider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { useUserContext } from "@/contexts/UserProvider"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

const { userId } = useUserContext()


  const { setAdminState, admin } = useAdminContext()
  const { setCompanyState, setCurrentCompanyId, setCompanies, setActiveCompany } = useCompanyContext()

  // Fetch admin details
  useEffect(() => {
    const fetchAdminDetails = async () => {
      if (!userId) return

      try {
        const result = await getAdminDetails(String(userId))
        if (result) {
          console.log("Admin details fetched:", result)
          setAdminState({ key: "admin", value: result })
        }
      } catch (error) {
        console.error("Error fetching admin details:", error)
      }
    }

      fetchAdminDetails()
    
  }, [userId])

  // Fetch company details once we have admin data
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (!admin?.[0]?.company_uid?.length) return

      const companyUids = admin[0].company_uid

      try {
        const companyData = await Promise.all(
          companyUids.map(async (companyId: string) => {
            return await getCompanyDetails(companyId)
          }),
        )

        console.log("Companies fetched:", companyData)

        // Now companyData should match the Company interface
        setCompanies(companyData)

        // Set the first company as active if we have companies and no active company
        if (companyData.length > 0) {
          setActiveCompany(companyData[0])
          setCurrentCompanyId(companyData[0].uid) 
        }
      } catch (error) {
        console.error("Error fetching company details:", error)
      }
    }

    if (admin?.[0]?.company_uid) {
      fetchCompanyDetails()
    }
  }, [admin])

 

  

  return (
    <SidebarProvider>
        <AppSidebar />
        {children}
    </SidebarProvider>
  )
}

