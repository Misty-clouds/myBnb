"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    noDropdown?: boolean
  }[]
}) {
  const router = useRouter();
  const navigateTo = (route: string) => {
    router.push(route)
  }

  return (
    <SidebarGroup>
      <div className="h-3"></div>
      <SidebarGroupLabel>Overview</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              tooltip={item.title}
              onClick={() => navigateTo(item.url)}
              className={`hover:text-primary ${item.isActive ? "bg-primary/30 text-primary border-l-2 border-primary-400" : ""}`}
            >
              {item.icon && <item.icon />}
              <span>{item.title}</span>
              {!item.noDropdown && <ChevronRight className="ml-auto" />}
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
