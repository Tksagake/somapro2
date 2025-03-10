"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminDashboard() {
  interface User {
    id: string;
    full_name: string;
    email: string;
    roles: { name: string }[];
  }

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      const { data, error } = await supabase
        .from("users")
        .select("id, full_name, email, roles(name)");

      if (error) console.error(error);
      else setUsers(data);
    }

    fetchUsers();
  }, []);

  const promoteToAdmin = async (userId: string) => {
    setLoading(true);
    const response = await fetch("/api/promote-user", {
      method: "POST",
      body: JSON.stringify({ userId, newRole: "Admin" }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) alert("User promoted to Admin!");
    else alert("Error promoting user");

    setLoading(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
      <table className="w-full bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3 text-left">Full Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="p-3">{user.full_name}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">{user.roles.map(role => role.name).join(", ") || "Unknown"}</td>
              <td className="p-3">
                {!user.roles.some(role => role.name === "Admin") && (
                  <button
                    onClick={() => promoteToAdmin(user.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    disabled={loading}
                  >
                    Promote to Admin
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
