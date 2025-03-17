"use client"

import type * as React from "react"
import { Settings2, LayoutDashboard, DollarSign, Calendar, HomeIcon as House } from "lucide-react"
import { usePathname } from "next/navigation"
import { NavMain } from "@/components/nav-main"
import { NavSingle } from "@/components/nav-single"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { useCompanyContext } from "@/contexts/CompanyProvider"
import { useAdminContext } from "@/contexts/AdminProvider"
import { useUserContext } from "@/contexts/UserProvider"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const baseNavLink = "/dashboard"
  const pathname = usePathname()
  const { userEmail } = useUserContext()

  const { admin } = useAdminContext()
  const { companies, activeCompany } = useCompanyContext()

  const teams = companies.map((company) => ({
    uid: company.uid,
    name: company.name,
    logo: company.logo,
    plan: company.plan,
  }))

  const isActive = (href: string): boolean => {
    if (!href) return false

    if (href === baseNavLink) {
      return pathname === href
    }

    const pathnameSegments = pathname.split("/").filter(Boolean)
    const hrefSegments = href.split("/").filter(Boolean)

    if (pathnameSegments.length > 1 && hrefSegments.length > 1) {
      return pathname.startsWith(href)
    }

    return pathname === href
  }

  const userData = {
    user: {
      name: userEmail ? userEmail.split("@")[0] : "User",
      email: userEmail || "",
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
