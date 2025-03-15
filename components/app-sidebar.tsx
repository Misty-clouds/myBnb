"use client"

import type * as React from "react"
import { Settings2, LayoutDashboard, DollarSign, Calendar, HomeIcon as House } from "lucide-react"
import { usePathname } from "next/navigation"
import { NavMain } from "@/components/nav-main"
import { NavSingle } from "@/components/nav-single"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { useUserContext } from "@/contexts/UserProvider"
import { useCompanyContext } from "@/contexts/CompanyProvider"
import { useAdminContext } from "@/contexts/AdminProvider"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const baseNavLink = "/dashboard"
  const pathname = usePathname()

  // Use the user context instead of useUser hook
  const { user } = useUserContext()
  const email = user?.email

  // Get data from contexts instead of fetching it here
  const { admin } = useAdminContext()
  const { companies, activeCompany } = useCompanyContext()

  const teams = companies.map((company) => ({
    id: company.id, 
    name: company.name,
    logo: company.logo,
    plan: company.plan,
  }))

  const isActive = (href: string): boolean => {
    if (!href) return false
    return pathname === href
  }

  const userData = {
    user: {
      name: user?.name || (email ? email.split("@")[0] : "User"),
      email: email || "",
      avatar: admin[0]?.photo_url || "/avatars/shadcn.jpg",
    },
    teams: teams,
    navMain: [
      {
        title: "Dashboard",
        url: baseNavLink,
        icon: LayoutDashboard,
        isActive: isActive(baseNavLink),
        noDropdown: true,
      },
      {
        title: "Booking",
        url: baseNavLink + "/booking",
        noDropdown: true,
        icon: Calendar,
        isActive: isActive(baseNavLink + "/booking"),
      },
      {
        title: "Expenses",
        url: baseNavLink + "/expenses",
        icon: DollarSign,
        noDropdown: true,
        isActive: isActive(baseNavLink + "/expenses"),
      },
      {
        title: "Properties",
        url: baseNavLink + "/properties",
        icon: House,
        noDropdown: true,
        isActive: isActive(baseNavLink + "/properties"),
      },
    ],
    projects: [
      {
        name: "Settings",
        url: baseNavLink + "/settings",
        icon: Settings2,
      },
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="bg-card">
        <TeamSwitcher teams={userData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={userData.navMain} />
        <NavSingle data={userData.projects} />
      </SidebarContent>
      <SidebarFooter className="bg-card">
        <NavUser user={userData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

