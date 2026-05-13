import { supabase } from "./supabase";

export async function getFavorites(userId) {
  const { data, error } = await supabase
    .from("favorites")
    .select("beach_name")
    .eq("user_id", userId);
  if (error) throw error;
  return data.map((r) => r.beach_name);
}

export async function addFavorite(userId, beachName) {
  const { error } = await supabase
    .from("favorites")
    .insert({ user_id: userId, beach_name: beachName });
  if (error) throw error;
}

export async function removeFavorite(userId, beachName) {
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("beach_name", beachName);
  if (error) throw error;
}
