"use client";

import { useAuth } from "../context/AuthContext";
import { FiBell, FiUser, FiLogOut } from "react-icons/fi";
import Link from "next/link";

export default function Navbar() {
  const { role, signOut } = useAuth();

  return (
    <nav className="bg-blue-100 text-black p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">SOMA PRO</h1>

      <div className="flex items-center space-x-4">
        <FiBell className="text-2xl cursor-pointer hover:text-gray-400" />
        
        <span className="text-sm">{role}</span>

        <FiUser className="text-2xl cursor-pointer hover:text-gray-400" />
        <button onClick={signOut} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600">
          <FiLogOut />
        </button>
      </div>
    </nav>
  );
}
