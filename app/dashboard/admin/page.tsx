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
      try {
        const { data, error } = await supabase
          .from("users")
          .select("id, full_name, email, roles(name)");

        if (error) {
          console.error("Error fetching users:", error);
        } else {
          setUsers(data);
        }
      } catch (error) {
        console.error("Unexpected error fetching users:", error);
      }
    }

    fetchUsers();
  }, []);

  const promoteToAdmin = async (userId: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/promote-user", {
        method: "POST",
        body: JSON.stringify({ userId, newRole: "Admin" }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        alert("User promoted to Admin!");
        // Optionally, refetch users to update the UI
        const updatedUsers = users.map(user =>
          user.id === userId ? { ...user, roles: [...user.roles, { name: "Admin" }] } : user
        );
        setUsers(updatedUsers);
      } else {
        const errorData = await response.json();
        alert(`Error promoting user: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Unexpected error promoting user:", error);
      alert("Unexpected error promoting user");
    } finally {
      setLoading(false);
    }
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