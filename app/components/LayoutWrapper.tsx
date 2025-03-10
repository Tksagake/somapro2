"use client";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideSidebar = pathname.startsWith("/auth"); // Hide sidebar for auth pages

  return (
    <div className="flex h-screen">
      {!hideSidebar && <Sidebar />} 
      <main className={`flex-1 p-6 ${hideSidebar ? "ml-0" : "ml-64"} bg-gray-100`}>
        {children}
      </main>
    </div>
  );
}
