import { supabase } from "./supabase";

export async function signUp(email, password) {
  return supabase.auth.signUp({ email, password });
}

export async function signIn(email, password) {
  return supabase.auth.signInWithPassword({ email, password });
}

const APP_URL = import.meta.env.VITE_APP_URL || window.location.origin;

export async function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: APP_URL },
  });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function resetPassword(email) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${APP_URL}/reset-password`,
  });
}

export async function updatePassword(newPassword) {
  return supabase.auth.updateUser({ password: newPassword });
}
