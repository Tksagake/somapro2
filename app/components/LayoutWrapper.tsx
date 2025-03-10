"use client";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth"); // Check if the current route is an auth page

  return (
    <div className="flex h-screen">
      {/* Conditionally render the Sidebar */}
      {!isAuthPage && <Sidebar />}

      {/* Main content area */}
      <main className="flex-1 p-6 bg-blue-100 overflow-y-auto">
        {/* Render the Navbar */}
        <Navbar />

        {/* Render the children (page content) */}
        {children}
      </main>
    </div>
  );
}