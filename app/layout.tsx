import { Inter } from "next/font/google";
import ClientLayout from "./components/ClientLayout";
import { AuthProvider } from "./context/AuthContext";
import AuthRouter from "./context/AuthRouter";
import LayoutWrapper from "./components/LayoutWrapper"; // Import the wrapper
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SOMA PRO",
  description: "School Management System",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100`}>
        <AuthProvider>
          <AuthRouter>
            <ClientLayout>
              {children}
            </ClientLayout>
          </AuthRouter>
        </AuthProvider>
      </body>
    </html>
  );
}
