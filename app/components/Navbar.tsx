"use client";

import { FiBell, FiUser } from "react-icons/fi";

export default function Navbar() {
  return (
    <div className="bg-white shadow-md p-4 flex justify-between items-center fixed top-0 left-64 right-0 z-10">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      <div className="flex items-center space-x-4">
        <FiBell className="text-gray-600 text-xl cursor-pointer hover:text-black" />
        <FiUser className="text-gray-600 text-xl cursor-pointer hover:text-black" />
      </div>
    </div>
  );
}
