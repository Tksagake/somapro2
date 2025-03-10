"use client";

import { supabase } from "../lib/supabase";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  user: any;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  };
  const getUserRole = async (userId: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("role_id, roles(name)")
      .eq("id", userId)
      .single();
  
    if (error) return null;
    return data?.roles?.[0]?.name;
  };
  

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
