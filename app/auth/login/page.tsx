"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      router.push("/dashboard");
    } catch (error) {
      alert((error as Error).message);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#15202B]">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-3xl font-bold text-center text-black mb-6">SOMA PRO</h2>
        <form onSubmit={handleLogin} className="space-y-6">
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

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-900 transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Forgot your password?{" "}
          <a href="/auth/forgot-password" className="text-blue-500 hover:underline">
            Reset it here
          </a>
        </p>

        <p className="text-center mt-4 text-gray-600">
          Don't have an account?{" "}
          <a href="/auth/signup" className="text-blue-500 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
}
