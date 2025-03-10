"use client";

import { supabase } from "../lib/supabase";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  user: any;
  role: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const getUserData = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);

      if (data.user) {
        const { data: userData } = data.user ? await supabase
          .from("users")
          .select("roles(name)")
          .eq("id", data.user.id)
          .single() : { data: null };

        setRole(userData?.roles?.[0]?.name || null);
      }
    };

    getUserData();
  }, []);

  const signUp = async (email: string, password: string, fullName: string, role: string) => {
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role }, // ✅ Store full_name & role in metadata
      },
    });

    if (error) throw error;
    setUser(data.user);

    // Assign the selected role in the database
    await supabase
      .from("users")
      .update({ role_id: (await getRoleId(role)) })
      .eq("id", data.user?.id);
  };

  // Fetch role ID from the database
  const getRoleId = async (role: string) => {
    const { data } = await supabase
      .from("roles")
      .select("id")
      .eq("name", role)
      .single();

    return data?.id;
  };

  const signIn = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setUser(data.user);

    // ✅ Fetch user role from public.users
    const { data: userData } = await supabase
      .from("users")
      .select("role_id")
      .eq("id", data.user.id)
      .single();

    if (!userData || !userData.role_id) {
      throw new Error("You are not authorized to log in.");
    }

    // ✅ Get role name from roles table
    const { data: roleData } = await supabase
      .from("roles")
      .select("name")
      .eq("id", userData.role_id)
      .single();

    if (!roleData || (roleData.name !== "Teacher" && roleData.name !== "Admin")) {
      throw new Error("You are not authorized to log in.");
    }

    setRole(roleData.name);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};