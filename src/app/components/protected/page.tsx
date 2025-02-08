"use client"

import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

// Type for ProtectedRouteProps, ensuring children is properly typed
interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/admin");  // Redirect if not logged in
    }
  }, [router]);

  return <>{children}</>;
}
