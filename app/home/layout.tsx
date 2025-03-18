"use client";

import type React from "react";
import { useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { getAdminDetails, getCompanyDetails } from "@/helper-functions";
import { useCompanyContext } from "@/contexts/CompanyProvider";
import { useAdminContext } from "@/contexts/AdminProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useUserContext } from "@/contexts/UserProvider";
import { createClient } from "@/utils/supabase/client";
import { useLocale } from "next-intl";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId, userEmail } = useUserContext();
  const { setAdminState, admin } = useAdminContext();
  const { setCompanies, setCurrentCompanyId, setActiveCompany } = useCompanyContext();

  useEffect(() => {
    const fetchAndInsertAdminDetails = async () => {
      if (!userId || !userEmail) return;

      try {
        const supabase = createClient();

        // Check if admin already exists
        const { data, error } = await supabase.from("admin_table").select("*").eq("uid", userId);

        if (error) {
          console.error("Error fetching admin details:", error.message);
          return;
        }

        if (Array.isArray(data) && data.length > 0) {
          console.log("Admin details found:", data);
          setAdminState({ key: "admin", value: data });
        } else {
          console.log("No admin details found. Inserting new admin...");

          // Insert new admin
          const { error: insertError } = await supabase.from("admin_table").insert([{ email: userEmail, uid: userId }]);

          if (insertError) {
            console.error("Error inserting admin details:", insertError.message);
          } else {
            console.log("Admin details inserted successfully.");
            const newAdminData = await getAdminDetails(String(userId));
            setAdminState({ key: "admin", value: newAdminData });
          }
        }
      } catch (err) {
        console.error("Unexpected error fetching admin details:", err);
      }
    };

    fetchAndInsertAdminDetails();
  }, [userId, userEmail]);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (!admin?.[0]?.company_uid?.length) return;

      const companyUids = admin[0].company_uid;

      try {
        const companyData = await Promise.all(
          companyUids.map(async (companyId: string) => await getCompanyDetails(companyId))
        );

        console.log("Companies fetched:", companyData);
        setCompanies(companyData);

        if (companyData.length > 0) {
          setActiveCompany(companyData[0]);
          setCurrentCompanyId(companyData[0].uid);
        }
      } catch (error) {
        console.error("Error fetching company details:", error);
      }
    };

    if (admin?.[0]?.company_uid) {
      fetchCompanyDetails();
    }
  }, [admin]);

  const locale = useLocale()

  return (
    <SidebarProvider>
{ locale==='en'&& <AppSidebar />}        
<main className="flex-1 p-4">{children}</main>
{ locale==='ar'&& <AppSidebar />}        

    </SidebarProvider>
  );
}
