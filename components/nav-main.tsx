"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
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

    items?: {
      title: string
      url: string
    }[]
  }[]
}) 
{
const router =useRouter();
const navigateTo=(route:string)=>{
  return (
    router.push(route)
  )
}


  return (
    <SidebarGroup>
    <div className="h-3"></div>

      <SidebarGroupLabel>Overview</SidebarGroupLabel>
      <SidebarMenu
       
      >
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className= {`group/collapsible hover:text-primar `}
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}
                onClick={() => navigateTo(item.url)}
                 className={`group/collapsible hover:text-primary  ${
                  item.isActive ? "bg-primary/30 text-primary border-l-2 border-primary-400" : ""
                }`}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  {item.noDropdown!==true&&<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  }
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub
                 className="hover:text-primary"
>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                      className="hover:text-primary"
                      asChild>
                        <a href={subItem.url}>
                          <span>{subItem.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
