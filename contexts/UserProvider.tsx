"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useUser } from "@/helper-functions";

interface UserContextType {
  userId: string | null;
  userEmail: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const user = useUser();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && user) {
      setUserId(user.id || null);
      setUserEmail(user.email || null);
    }
  }, [isMounted, user]);

  if (!isMounted) return null;

  return <UserContext.Provider value={{ userId, userEmail }}>{children}</UserContext.Provider>;
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}
