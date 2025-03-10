"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user, role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // ✅ Allow access to signup & forgot password pages
    const publicPages = ["/auth/login", "/auth/signup", "/auth/forgot-password"];

    if (!user && !publicPages.includes(pathname)) {
      router.push("/auth/login");
    }
  }, [user, router, pathname]);

  return <>{children}</>;
}
