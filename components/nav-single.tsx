"use client"

import { type LucideIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavSingle({
  data,
}: {
  data: {
    name: string
    url: string
    icon: LucideIcon
    isActive?: boolean
  }[]
}) {
  const router = useRouter();
  const navigateTo = (route: string) => {
    router.push(route)
  }

  return (
    <SidebarGroup>
      <div className="h-3"></div>
      <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
      <SidebarMenu>
        {data.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              tooltip={item.name}
              onClick={() => navigateTo(item.url)}
              className={`hover:text-primary ${item.isActive ? "bg-primary/30 text-primary border-l-2 border-primary-400" : ""}`}
            >
              <item.icon />
              <span>{item.name}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
