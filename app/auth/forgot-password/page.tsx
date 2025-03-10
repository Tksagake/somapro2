"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`, // Redirect after reset
      });
      if (error) throw error;
      alert("Password reset email sent! Check your inbox.");
    } catch (error) {
      alert((error as Error).message);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleReset} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-2 border mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2"
          disabled={loading}
        >
          {loading ? "Sending..." : "Reset Password"}
        </button>
        <p className="mt-4 text-center">
          <a href="/auth/login" className="text-blue-500">Back to Login</a>
        </p>
      </form>
    </div>
  );
}
