"use client";

import { FiUsers, FiDollarSign, FiBookOpen } from "react-icons/fi";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Sidebar from "../components/sidebar";
import Navbar from "../components/Navbar";

const stats = [
  { title: "Total Students", value: "1,200", icon: <FiUsers /> },
  { title: "Total Revenue", value: "$45,000", icon: <FiDollarSign /> },
  { title: "Active Teachers", value: "35", icon: <FiBookOpen /> },
];

const data = [
  { month: "Jan", revenue: 5000 },
  { month: "Feb", revenue: 8000 },
  { month: "Mar", revenue: 6000 },
  { month: "Apr", revenue: 9000 },
  { month: "May", revenue: 7500 },
];

export default function Dashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64 p-6 bg-gray-100 min-h-screen">
        <Navbar />

        {/* Stats Cards */}
        <div className="mt-20 grid grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
              <div className="text-3xl text-gray-700">{stat.icon}</div>
              <div>
                <p className="text-gray-600">{stat.title}</p>
                <h3 className="text-2xl font-semibold">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Revenue Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#007bff" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
