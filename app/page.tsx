"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";
import { supabase } from "./lib/supabase";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    const fetchRole = async () => {
      const { data } = await supabase
        .from("users")
        .select("role_id, roles(name)")
        .eq("id", user.id)
        .single();
      if (data) setRole(data.roles[0].name);
    };

    fetchRole();
  }, [user, router]);

  if (!role) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome, {role}</h1>
      <button onClick={signOut} className="mt-4 bg-red-500 text-white px-4 py-2">
        Logout
      </button>
    </div>
  );
}
