"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { FiHome, FiUser, FiSettings, FiBook, FiLogOut, FiDollarSign, FiClipboard, FiBox, FiMessageSquare } from "react-icons/fi";
import { JSX } from "react";
import { useState } from "react";

export default function Sidebar() {
  const { role, signOut } = useAuth();

  // Define menu items based on roles
  const menuItems: Record<string, { name: string; path: string; icon: JSX.Element; subItems?: { name: string; path: string }[] }[]> = {
    "Admin": [
      { name: "Dashboard", path: "/dashboard", icon: <FiHome /> },
      { name: "Students", path: "/students", icon: <FiUser />, subItems: [
        { name: "Student List", path: "/students" },
        { name: "Admissions", path: "/students/admissions" },
        { name: "Attendance", path: "/students/attendance" },
        
      ]},
      { name: "Academics", path: "/academics", icon: <FiClipboard />, subItems: [
        { name: "Overview", path: "/academics" },
        { name: "Classes", path: "/academics/streams" },
        { name: "Subjects", path: "/academics/subjects" },
        //{ name: "Exams", path: "/academics/exams" },
        //{ name: "Results", path: "/academics/results" },
      ] },
      { name: "Finance", path: "/finance", icon: <FiDollarSign /> },
      { name: "Grade Approvals", path: "/grades", icon: <FiClipboard /> },
      { name: "Communications", path: "/communication", icon: <FiMessageSquare /> },
      { name: "Library Management", path: "/library", icon: <FiBook /> },
      { name: "Users", path: "/dashboard/admin", icon: <FiUser /> },
      { name: "Settings", path: "/settings", icon: <FiSettings /> },
      { name: "Dormitory Tracking", path: "/boarding", icon: <FiBox /> },
    ],
    "Teacher": [
      { name: "Dashboard", path: "/dashboard", icon: <FiHome /> },
      { name: "Students", path: "/students", icon: <FiClipboard />, subItems: [
      { name: "All students", path: "/students" },
      { name: "Assignments", path: "/classes/assignments" },
      ]},
      { name: "Gradebook", path: "/gradebook", icon: <FiClipboard /> },
      { name: "Communications", path: "/communication", icon: <FiMessageSquare /> },
      { name: "Library", path: "/library", icon: <FiBook /> },
      { name: "Settings", path: "/settings", icon: <FiSettings /> },
    ],
    "Parent": [
      { name: "Dashboard", path: "/dashboard", icon: <FiHome /> },
      { name: "My Children", path: "/children", icon: <FiUser />, subItems: [
      { name: "Attendance", path: "/children/attendance" },
      { name: "Grades", path: "/children/grades" },
      ]},
      { name: "Finance", path: "/finance", icon: <FiDollarSign /> },
      { name: "Communications", path: "/communication", icon: <FiMessageSquare /> },
      { name: "Library", path: "/library", icon: <FiBook /> },
      { name: "Settings", path: "/settings", icon: <FiSettings /> },
    ],
    "Librarian": [
      { name: "Dashboard", path: "/dashboard", icon: <FiHome /> },
      { name: "Manage Books", path: "/library/manage", icon: <FiBook />, subItems: [
      { name: "Add Books", path: "/library/manage/add" },
      { name: "Remove Books", path: "/library/manage/remove" },
      ]},
      { name: "Issue Books", path: "/library/issue", icon: <FiClipboard /> },
      { name: "Return Books", path: "/library/return", icon: <FiClipboard /> },
      { name: "Settings", path: "/settings", icon: <FiSettings /> },
    ],
  };

  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (name: string) => {
    setOpenItems((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    );
  };

  return (
    <nav className="bg-gray-800 text-white w-64 h-screen p-6 shadow-lg overflow-y-auto">
      <img className="w-25 h-15 rounded-full mx-auto" src="/logo.png" alt="School Logo" />
      <h1 className="text-xl font-bold mb-6">SOMA PRO</h1>
      <ul>
        {role &&
          menuItems[role]?.map((item) => (
            <li key={item.path} className="mb-2">
              <div onClick={() => toggleItem(item.name)} className="flex items-center space-x-2 p-3 hover:bg-gray-700 rounded cursor-pointer">
                {item.icon}
                <span>{item.name}</span>
              </div>
              {item.subItems && openItems.includes(item.name) && (
                <ul className="ml-6 mt-2">
                  {item.subItems.map((subItem) => (
                    <li key={subItem.path} className="mb-1">
                      <Link href={subItem.path} className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
                        <span>{subItem.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
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