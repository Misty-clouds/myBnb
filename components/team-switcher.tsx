"use client"

import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"
import { CompanyDialog } from "./New/form/dialog/company-dialog"
import { useCompanyContext } from "@/contexts/CompanyProvider"

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

export function TeamSwitcher({
  teams,
}: {
  teams: {
    uid: string
    name: string
    logo: string
    plan: string
  }[]
}) {
  const { isMobile } = useSidebar()
  const [isCompanyDialogOpen, setIsCompanyDialogOpen] = React.useState(false)

  // Use company context to manage active company
  const { activeCompany, setActiveCompany, setCurrentCompanyId } = useCompanyContext()

  // Set initial active company if not already set
  React.useEffect(() => {
    if (!activeCompany && teams.length > 0) {
      const firstCompany = teams[0]
      setActiveCompany({
        uid: firstCompany.uid,
        name: firstCompany.name,
        logo: firstCompany.logo,
        plan: firstCompany.plan,
      })
      setCurrentCompanyId(firstCompany.uid)
    }
  }, [teams, activeCompany, setActiveCompany, setCurrentCompanyId])

  const handleCompanySelect = (team: (typeof teams)[0]) => {
    setActiveCompany({
      uid: team.uid,
      name: team.name,
      logo: team.logo,
      plan: team.plan,
    })
    setCurrentCompanyId(team.uid)
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
                    <Image src={activeCompany.logo } alt="avatar" width={30} height={30} />
                  ) : (
                    <Logo width={30} height={30} />
                  )}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{activeCompany ? activeCompany.name : "MyBnB"}</span>
                  <span className="truncate text-xs">{activeCompany ? activeCompany.plan : "Test"}</span>
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
              <DropdownMenuLabel className="text-xs text-muted-foreground">My Companies</DropdownMenuLabel>
              {teams.map((team, index) => (
                <DropdownMenuItem
                  key={team.uid || team.name}
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

      <CompanyDialogWrapper
        isOpen={isCompanyDialogOpen}
        onOpenChange={setIsCompanyDialogOpen}
        onCompanyAdded={(newCompany) => {
          if (newCompany) {
            setActiveCompany(newCompany)
            setCurrentCompanyId(newCompany.uid)
          }
        }}
      />
    </>
  )
}

function CompanyDialogWrapper({
  isOpen,
  onOpenChange,
  onCompanyAdded,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onCompanyAdded?: (newCompany: any) => void
}) {
  return (
    <CompanyDialog
      open={isOpen}
      onOpenChange={onOpenChange}
      onCompanyAdded={(newCompany) => {
        if (onCompanyAdded && newCompany) {
          onCompanyAdded(newCompany)
        }
      }}
    />
  )
}

