'use client'
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";


const supabase =createClient();
const useAuth = () => {
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || event === "SIGNED_IN") {
        localStorage.removeItem("companyState");
      }

      if (event === "SIGNED_IN") {
        localStorage.removeItem("companyState");
      }
    });

    // Clean up listener when component unmounts
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);
};

export default useAuth;
