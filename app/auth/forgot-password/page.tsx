"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;
      setMessage("Password reset link sent! Check your inbox.");
    } catch (error) {
      setMessage((error as Error).message);
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#15202B]">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center text-black mb-6">Reset Password</h2>
        <p className="text-center text-gray-600 mb-4">
          Enter your email, and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleReset} className="space-y-6">
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

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-900 transition"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {message && <p className="text-center text-sm text-gray-700 mt-4">{message}</p>}

        <p className="text-center mt-4 text-gray-600">
          <a href="/auth/login" className="text-blue-500 hover:underline">Back to Login</a>
        </p>
      </div>
    </div>
  );
}
