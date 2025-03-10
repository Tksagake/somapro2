import { NextResponse } from "next/server";
import { supabase } from "../lib/supabase";

export async function POST(req: Request) {
  const { userId, newRole } = await req.json();

  // Ensure only Admins can do this
  const adminCheck = await supabase.auth.getUser();
  const { data: adminData } = await supabase
    .from("users")
    .select("roles(name)")
    .eq("id", adminCheck.data.user?.id)
    .single();

  if (!adminData?.roles?.some((role: { name: string }) => role.name === "Admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Get Role ID for new role
  const { data: roleData } = await supabase
    .from("roles")
    .select("id")
    .eq("name", newRole)
    .single();

  if (!roleData) {
    return NextResponse.json({ error: "Role not found" }, { status: 400 });
  }

  // Update user role
  const { error } = await supabase
    .from("users")
    .update({ role_id: roleData.id })
    .eq("id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
