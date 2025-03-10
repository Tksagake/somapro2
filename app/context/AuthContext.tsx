"use client";

import { supabase } from "../lib/supabase";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  user: any;
  role: string | null;
  signIn: (email: string, password: string) => Promise<void>;
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
        const { data: userData } = await supabase
          .from("users")
          .select("roles(name)")
          .eq("id", data.user.id)
          .single();

        setRole(userData?.roles?.[0]?.name || null);
      }
    };

    getUserData();
  }, []);

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
    <AuthContext.Provider value={{ user, role, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
