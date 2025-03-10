import { Inter } from "next/font/google";
import ClientLayout from "./components/ClientLayout"; // Handles client-side logic
import { AuthProvider } from "./context/AuthContext";
import "./globals.css"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SOMA PRO",
  description: "School Management System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}> {/* ✅ Styling is still applied */}
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
