"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { FiHome, FiUser, FiSettings, FiBook, FiLogOut, FiDollarSign, FiClipboard, FiBox, FiMessageSquare } from "react-icons/fi";
import { JSX } from "react";

export default function Sidebar() {
  const { role, signOut } = useAuth();

  // Define menu items based on roles
  const menuItems: Record<string, { name: string; path: string; icon: JSX.Element }[]> = {
    "Super Admin": [
      { name: "Dashboard", path: "/dashboard", icon: <FiHome /> },
      { name: "Users", path: "/users", icon: <FiUser /> },
      { name: "Finance", path: "/finance", icon: <FiDollarSign /> },
      { name: "Settings", path: "/settings", icon: <FiSettings /> },
    ],
    "Librarian": [
      { name: "Library Management", path: "/library", icon: <FiBook /> },
    ],
    "Dean of Studies": [
      { name: "Grade Approvals", path: "/grades", icon: <FiClipboard /> },
    ],
    "Finance Officer": [
      { name: "Payments", path: "/payments", icon: <FiDollarSign /> },
      { name: "Invoices & Receipts", path: "/finance", icon: <FiClipboard /> },
    ],
    "Boarding": [
      { name: "Dormitory Tracking", path: "/boarding", icon: <FiBox /> },
    ],
    "Store Manager": [
      { name: "Inventory", path: "/store", icon: <FiBox /> },
    ],
    "Deputy Principal": [
      { name: "Admissions", path: "/admissions", icon: <FiUser /> },
      { name: "Student Reports", path: "/reports", icon: <FiClipboard /> },
      { name: "Communications", path: "/messages", icon: <FiMessageSquare /> },
    ],
    "Teacher": [
      { name: "My Classes", path: "/academics", icon: <FiBook /> },
      { name: "Upload Grades", path: "/grades/upload", icon: <FiClipboard /> },
    ],
    "Student": [
      { name: "My Grades", path: "/grades", icon: <FiClipboard /> },
      { name: "Timetable", path: "/timetable", icon: <FiBook /> },
      { name: "Announcements", path: "/messages", icon: <FiMessageSquare /> },
    ],
    "Parent": [
      { name: "Fee Statements", path: "/finance", icon: <FiDollarSign /> },
      { name: "Child’s Grades", path: "/grades", icon: <FiClipboard /> },
      { name: "Announcements", path: "/messages", icon: <FiMessageSquare /> },
    ],
  };

  return (
    <nav className="bg-gray-800 text-white w-64 h-screen p-6 shadow-lg">
      <h1 className="text-xl font-bold mb-6">School System</h1>
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
