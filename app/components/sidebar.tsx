"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { FiHome, FiUser, FiSettings, FiBook, FiLogOut, FiDollarSign, FiClipboard, FiBox, FiMessageSquare } from "react-icons/fi";
import { JSX } from "react";

export default function Sidebar() {
  const { role, signOut } = useAuth();

  // Define menu items based on roles
  const menuItems: Record<string, { name: string; path: string; icon: JSX.Element }[]> = {
    "Admin": [
      { name: "Dashboard", path: "/dashboard", icon: <FiHome /> },
      { name: "Students", path: "/students", icon: <FiUser /> },
      { name: "Academics", path: "/academics", icon: <FiClipboard /> },
      { name: "Finance", path: "/finance", icon: <FiDollarSign /> },
      { name: "Grade Approvals", path: "/grades", icon: <FiClipboard /> },
      { name: "Communications", path: "/communication", icon: <FiMessageSquare /> },
      { name: "Library Management", path: "/library", icon: <FiBook /> },
      { name: "Users", path: "/dashboard/admin", icon: <FiUser /> },
      { name: "Settings", path: "/settings", icon: <FiSettings /> },
      { name: "Dormitory Tracking", path: "/boarding", icon: <FiBox /> },
    ],
    "Librarian": [
      { name: "Dashboard", path: "/dashboard", icon: <FiHome /> },
      { name: "Library Management", path: "/library", icon: <FiBook /> },
    ],
    "Dean of Studies": [
      { name: "Dashboard", path: "/dashboard", icon: <FiHome /> },
      { name: "Grades", path: "/grades", icon: <FiClipboard /> },
    ],
    "Finance Officer": [
      { name: "Dashboard", path: "/dashboard", icon: <FiHome /> },
      { name: "Payments", path: "/payments", icon: <FiDollarSign /> },
    ],
    "Boarding": [
      { name: "Dashboard", path: "/dashboard", icon: <FiHome /> },
      { name: "Dormitory Tracking", path: "/boarding", icon: <FiBox /> },
    ],
    "Store Manager": [
      { name: "Dashboard", path: "/dashboard", icon: <FiHome /> },
      { name: "Inventory", path: "/store", icon: <FiBox /> },
    ],
    "Deputy Principal": [
      { name: "Dashboard", path: "/dashboard", icon: <FiHome /> },
      { name: "Admissions", path: "/admissions", icon: <FiUser /> },
      { name: "Student Reports", path: "/reports", icon: <FiClipboard /> },
      { name: "Communications", path: "/communication", icon: <FiMessageSquare /> },
    ],
    "Teacher": [
      { name: "Dashboard", path: "/dashboard", icon: <FiHome /> },
      { name: "Students", path: "/students", icon: <FiUser /> },
      { name: "Upload Grades", path: "/grades/upload", icon: <FiClipboard /> },
    ],
    "Parent": [
      { name: "Fee Statements", path: "/finance", icon: <FiDollarSign /> },
      { name: "Students", path: "/students/[id]", icon: <FiUser /> },
    ],
  };

  return (
    <nav className="bg-gray-800 text-white w-64 h-screen p-6 shadow-lg overflow-y-auto">
      <img className="w-25 h-15 rounded-full mx-auto" src="/logo.png" alt="School Logo" />
      <h1 className="text-xl font-bold mb-6">SOMA PRO</h1>
      <ul>
        {role &&
          menuItems[role]?.map((item) => (
            <li key={item.path} className="mb-2">
              <Link href={item.path} className="flex items-center space-x-2 p-3 hover:bg-gray-700 rounded">
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
      </ul>
      <button onClick={signOut} className="mt-6 w-full flex items-center space-x-2 p-3 bg-red-500 rounded hover:bg-red-600">
        <FiLogOut />
        <span>Logout</span>
      </button>
    </nav>
  );
}