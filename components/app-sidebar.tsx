"use client"

import { useEffect } from "react"
import * as React from "react"
import { 
  Settings2,
  LayoutDashboard,
  DollarSign,
  Calendar,
  House
} from "lucide-react"
import { usePathname } from "next/navigation"
import { NavMain } from "@/components/nav-main"
import { NavSingle } from "@/components/nav-single"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {useUser} from "@/helper-functions"
import { useState } from "react"
import { getAdminDetails,getCompanyDetails } from "@/helper-functions"



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const baseNavLink = '/dashboard';
  const [name, setName] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('');
  const [companyUids, setCompanyUids] = useState<string[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const pathname = usePathname();
  const user = useUser();
  const id = user?.id;
  const email=user?.email;

  const teams = companies.map((company) => ({
    name: company.name,
    logo: company.logo,
    plan: company.plan,
  }));
  
  useEffect(() => {
    const fetchAdminDetails = async () => {
      if (!id) return;
      
      console.log("Fetching admin details for ID:", id);
      
      try {
        const response = await getAdminDetails(id);
        console.log("Raw response from getAdminDetails:", response);
        
        if (!response) {
          console.warn("No data received from getAdminDetails");
          return;
        }
        
        const data = response;
        console.log("Parsed admin details:", data);
        
        // Check if data.name exists, otherwise use fallbacks
        setName( "User"); 
        setCompanyUids(data.company_uid || []);
        setAvatar(data.photo_url || "");
      } catch (error) {
        console.error("Error fetching admin details:", error);
      }
    };
    
    fetchAdminDetails();
  }, [id]);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (companyUids.length === 0) return;
      
      try {
        const companyData = await Promise.all(
          companyUids.map(async (companyId) => {
            return await getCompanyDetails(companyId);
          })
        );
        setCompanies(companyData);
      } catch (error) {
        console.error("Error fetching company details:", error);
      }
    };
    
    fetchCompanyDetails();
  }, [companyUids]);

  const isActive = (href: string): boolean => {
    if (!href) return false;
    return pathname === href;
  };

  const userData = {
    user: {
      name:  email?email.split('@')[0] : "User", 
      email: email || "",
      avatar: avatar || "/avatars/shadcn.jpg",
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
        url: baseNavLink+"/booking",
        noDropdown: true,
        icon: Calendar, 
        isActive: isActive(baseNavLink+"/booking"),
      
      },
   
      {
        title: "Expenses",
        url: baseNavLink+"/expenses",
        icon: DollarSign,
        noDropdown: true,
        isActive: isActive(baseNavLink+"/expenses"),

      },
      {
        title: "Properties",
        url: baseNavLink+"/properties",
        icon: House,
        noDropdown: true,
        isActive: isActive(baseNavLink+"/properties"),
      },
  
    ],
    projects: [
      {
        name: "Settings",
        url: baseNavLink+"/settings",
        icon: Settings2,
      },
    ],
  };

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
  );
}

