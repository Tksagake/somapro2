"use client"; // ✅ Mark this as a client component

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user, role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    // Role-based access control
    const rolePages: Record<string, string[]> = {
      Admin: ["/dashboard", "/users", "/finance", "/settings"],
      Teacher: ["/dashboard", "/academics", "/library"],
      Student: ["/dashboard", "/grades", "/co-curricular"],
      Parent: ["/dashboard", "/fees", "/communication"],
    };

    if (role && !rolePages[role]?.includes(pathname)) {
      router.push("/dashboard");
    }
  }, [user, role, router, pathname]);

  return <>{children}</>;
}
