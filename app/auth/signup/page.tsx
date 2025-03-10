"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";

const signUp = async (email: string, password: string, fullName: string, role: string) => {
  // Your signUp logic here
};

export default function Signup() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("Teacher"); // Default role
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch available roles
    const fetchRoles = async () => {
      const { data } = await supabase.from("roles").select("name");
      setRoles(data?.map((role) => role.name) || []);
    };
    fetchRoles();
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Assuming the `signUp` function expects (email, password, fullName)
      await signUp(email, password, fullName, role);
      alert("Signup successful! You can now log in.");
      router.push("/auth/login");
    } catch (error) {
      alert((error as Error).message);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#15202B]">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-3xl font-bold text-center text-black mb-6">Create an Account</h2>
        <form onSubmit={handleSignup} className="space-y-6">
          {/* Full Name */}
          <div className="relative">
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="peer w-full p-3 border border-gray-300 rounded focus:border-black focus:ring-0 bg-gray-50 text-black"
              required
            />
            <label
              htmlFor="fullName"
              className="absolute left-3 top-3 text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-400 transition-all duration-200 text-sm peer-focus:top-1 peer-focus:text-xs peer-focus:text-black"
            >
              Full Name
            </label>
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full p-3 border border-gray-300 rounded focus:border-black focus:ring-0 bg-gray-50 text-black"
              required
            />
            <label
              htmlFor="email"
              className="absolute left-3 top-3 text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-400 transition-all duration-200 text-sm peer-focus:top-1 peer-focus:text-xs peer-focus:text-black"
            >
              Email
            </label>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full p-3 border border-gray-300 rounded focus:border-black focus:ring-0 bg-gray-50 text-black"
              required
            />
            <label
              htmlFor="password"
              className="absolute left-3 top-3 text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-400 transition-all duration-200 text-sm peer-focus:top-1 peer-focus:text-xs peer-focus:text-black"
            >
              Password
            </label>
          </div>

          {/* Role Selection */}
          <select
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-900 transition"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
