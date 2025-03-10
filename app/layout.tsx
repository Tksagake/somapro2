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
  favicon: "/favicon.co",
  icon: "/favicon.ico",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href={metadata.favicon} />
        <link rel="icon" href="/favicon.ico" type="/favicon.ico" />
      </head>
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
