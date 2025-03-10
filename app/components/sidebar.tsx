"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { FiHome, FiUser, FiSettings, FiBook, FiLogOut } from "react-icons/fi";
import { JSX } from "react";

export default function Sidebar() {
  const { role, signOut } = useAuth();

  const menuItems: Record<string, { name: string; path: string; icon: JSX.Element }[]> = {
    Admin: [
      { name: "Dashboard", path: "/dashboard", icon: <FiHome /> },
      { name: "Users", path: "/users", icon: <FiUser /> },
      { name: "Finance", path: "/finance", icon: <FiBook /> },
      { name: "Settings", path: "/settings", icon: <FiSettings /> },
    ],
    Teacher: [
      { name: "Dashboard", path: "/dashboard", icon: <FiHome /> },
      { name: "Academics", path: "/academics", icon: <FiBook /> },
      { name: "Library", path: "/library", icon: <FiBook /> },
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
