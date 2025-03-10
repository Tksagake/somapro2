"use client";

import { supabase } from "../lib/supabase";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  user: any;
  role: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
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

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }, // ✅ Store full name in metadata
      },
    });

    if (error) throw error;
    setUser(data.user);

    // Fetch user role after signing up
    const { data: userData } = data.user ? await supabase
      .from("users")
      .select("roles(name)")
      .eq("id", data.user.id)
      .single() : { data: null };

    setRole(userData?.roles?.[0]?.name || null);
  };

  const signIn = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setUser(data.user);

    const { data: userData } = await supabase
      .from("users")
      .select("roles(name)")
      .eq("id", data.user.id)
      .single();

    setRole(userData?.roles?.[0]?.name || null);
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
