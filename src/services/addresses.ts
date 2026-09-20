import { supabase } from "../supabaseClient";
import type { AddressRow } from "../types/database";

export type NewAddress = {
  label: string;
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  region: string;
  postal_code: string;
  country: string;
  is_default?: boolean;
};

export async function getAddresses(): Promise<AddressRow[]> {
  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching addresses:", error.message);
    return [];
  }

  return data ?? [];
}

export async function createAddress(userId: string, address: NewAddress): Promise<AddressRow | null> {
  const { data, error } = await supabase
    .from("addresses")
    .insert({ user_id: userId, ...address })
    .select()
    .single();

  if (error) {
    console.error("Error creating address:", error.message);
    return null;
  }

  return data;
}

export async function deleteAddress(id: string): Promise<boolean> {
  const { error } = await supabase.from("addresses").delete().eq("id", id);

  if (error) {
    console.error("Error deleting address:", error.message);
    return false;
  }

  return true;
}
