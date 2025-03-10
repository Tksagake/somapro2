"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function Signup() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp(email, password, fullName);
      alert("Signup successful! Admin approval may be required.");
      router.push("/dashboard");
    } catch (error) {
      alert((error as Error).message);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#15202B]">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-3xl font-bold text-center text-black mb-6">Create a Teacher Account</h2>
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
