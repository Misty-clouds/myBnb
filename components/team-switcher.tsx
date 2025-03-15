"use client"

import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"
import { useCompanyContext } from "@/contexts/CompanyProvider"
import { useUserContext } from "@/contexts/UserProvider"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import Image from "next/image"
import Logo from "@/images/logo"
import { CompanyDialogAdapter } from "./company-dialog-adapter"

export function TeamSwitcher({
  teams,
}: {
  teams: {
    id: number
    name: string
    logo: string
    plan: string
  }[]
}) {
  const { isMobile } = useSidebar()
  const [isCompanyDialogOpen, setIsCompanyDialogOpen] = React.useState(false)

  // Use user context
  const { user } = useUserContext()

  // Use company context to manage active company
  const { activeCompany, setActiveCompany, setCurrentCompanyId } = useCompanyContext()

  // Set initial active company if not already set - with a ref to prevent infinite updates
  const initialSetupDone = React.useRef(false)

  React.useEffect(() => {
    if (!activeCompany && teams.length > 0 && !initialSetupDone.current) {
      initialSetupDone.current = true
      const firstCompany = teams[0]
      setActiveCompany({
        id: firstCompany.id,
        name: firstCompany.name,
        logo: firstCompany.logo,
        plan: firstCompany.plan,
      })
      setCurrentCompanyId(firstCompany.id)
    }
  }, [teams, activeCompany, setActiveCompany, setCurrentCompanyId])

  const handleCompanySelect = (team: (typeof teams)[0]) => {
    setActiveCompany({
      id: team.id,
      name: team.name,
      logo: team.logo,
      plan: team.plan,
    })
    setCurrentCompanyId(team.id)
  }

  const handleAddCompany = () => {
    setIsCompanyDialogOpen(true)
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem className="">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="bg-primary/10 data-[state=open]:bg-primary/10 data-[state=open]:text-sidebar-accent-foreground hover:bg-primary/20 "
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-card text-sidebar-primary-foreground">
                  {activeCompany && activeCompany.logo ? (
                    <Image src={activeCompany.logo || "/placeholder.svg"} alt="avatar" width={30} height={30} />
                  ) : (
                    <Logo width={30} height={30} />
                  )}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{activeCompany ? activeCompany.name : "MyBnB"}</span>
                  <span className="truncate text-xs">{activeCompany ? activeCompany.plan : "Entry"}</span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                {user?.name || user?.email?.split("@")[0]}'s Companies
              </DropdownMenuLabel>
              {teams.map((team, index) => (
                <DropdownMenuItem
                  key={team.id || team.name}
                  onClick={() => handleCompanySelect(team)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    {team.logo ? (
                      <Image src={team.logo || "/placeholder.svg"} alt="logo" className="size-4 shrink-0" />
                    ) : (
                      <Logo width={30} height={30} />
                    )}
                  </div>
                  {team.name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 p-2 cursor-pointer" onClick={handleAddCompany}>
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus className="size-4" />
                </div>
                <span>Add New Company</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <CompanyDialogAdapter
        open={isCompanyDialogOpen}
        onOpenChange={setIsCompanyDialogOpen}
        onCompanyAdded={(newCompany) => {
          if (newCompany) {
            setActiveCompany(newCompany)
            setCurrentCompanyId(newCompany.id)
          }
        }}
      />
    </>
  )
}

