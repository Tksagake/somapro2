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
  const [loading, setLoading] = useState(true); // ✅ Fix logout on refresh

  // Fetch user role from database
  const fetchUserRole = async (userId: string) => {
    console.log("🔍 Fetching role for user:", userId);
    
    // Step 1: Fetch user data with role_id
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role_id")
      .eq("id", userId)
      .single();
  
    if (userError) {
      console.error("❌ Error fetching user data:", userError);
      return;
    }
  
    console.log("✅ Fetched user data:", userData);
  
    if (!userData?.role_id) {
      console.error("⚠️ No role_id found for user:", userId);
      return;
    }
  
    // Step 2: Fetch role name from roles table
    const { data: roleData, error: roleError } = await supabase
      .from("roles")
      .select("name")
      .eq("id", userData.role_id)
      .single();
  
    if (roleError) {
      console.error("❌ Error fetching role:", roleError);
      return;
    }
  
    console.log("✅ User role:", roleData?.name);
    setRole(roleData?.name || null);
  };

  // ✅ Fix session persistence issue
  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Session error:", error);
        setLoading(false);
        return;
      }

      if (session?.user) {
        setUser(session.user);
        await fetchUserRole(session.user.id);
      }
      setLoading(false);
    };

    checkSession();

    // ✅ Listen for session changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session);
      setUser(session?.user || null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setRole(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string, role: string) => {
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
      },
    });

    if (error) throw error;
    setUser(data.user);

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

    const { data: userData } = await supabase
      .from("users")
      .select("role_id")
      .eq("id", data.user.id)
      .single();

    if (!userData || !userData.role_id) {
      throw new Error("You are not authorized to log in.");
    }

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
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
