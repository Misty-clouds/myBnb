
"use client";

import useAuth from "../hooks/useAuth"; // Import your custom hook

const AuthListenerWrapper = ({ children }: { children: React.ReactNode }) => {
  useAuth();

  return (
    <>
      {children}
    </>
  );
};

export default AuthListenerWrapper;
