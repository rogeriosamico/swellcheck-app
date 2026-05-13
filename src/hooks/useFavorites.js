import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getFavorites, addFavorite, removeFavorite } from "@/lib/favorites";

export function useFavorites({ onUnauthenticated } = {}) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setFavorites(new Set());
      setLoading(false);
      return;
    }
    setLoading(true);
    getFavorites(user.id)
      .then((names) => setFavorites(new Set(names)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const toggle = async (beachName) => {
    if (!user) { onUnauthenticated?.(); return; }
    const isFav = favorites.has(beachName);

    setFavorites((prev) => {
      const next = new Set(prev);
      if (isFav) next.delete(beachName);
      else next.add(beachName);
      return next;
    });

    try {
      if (isFav) await removeFavorite(user.id, beachName);
      else await addFavorite(user.id, beachName);
    } catch {
      setFavorites((prev) => {
        const next = new Set(prev);
        if (isFav) next.add(beachName);
        else next.delete(beachName);
        return next;
      });
    }
  };

  return { favorites, loading, toggle };
}
