import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import Header from "@/components/Header";
import BeachCard from "@/components/BeachCard";
import { HomeCardSkeleton } from "@/components/Skeleton";
import { useFavorites } from "@/hooks/useFavorites";
import { BEACHES_META, CONDITIONS } from "@/lib/constants";
import { fetchForecastAll } from "@/lib/api";
import { getToday } from "@/lib/dates";

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { favorites, loading: favLoading } = useFavorites();
  const [allBeaches, setAllBeaches] = useState([]);
  const [beachLoading, setBeachLoading] = useState(true);
  const currentHour = new Date().getHours();
  const todayIso = getToday();

  useEffect(() => {
    fetchForecastAll(todayIso)
      .then(({ beaches }) => setAllBeaches(beaches))
      .catch(() => {})
      .finally(() => setBeachLoading(false));
  }, [todayIso]);

  const loading = favLoading || beachLoading;
  const favBeaches = allBeaches.filter((b) => favorites.has(b.beach));

  const goToBeach = (beachName) => {
    const slug = BEACHES_META[beachName]?.slug;
    if (!slug) return;
    navigate(`/praia/${slug}`);
  };

  return (
    <div style={{ width: "100%", maxWidth: 680, margin: "0 auto", padding: "0 0 80px" }}>
      <Header
        variant="beach"
        title="Favoritos"
        onBack={() => navigate(-1)}
      />

      <div style={{ padding: "16px 16px 0" }}>
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
            {[0, 1, 2].map((i) => <HomeCardSkeleton key={i} />)}
          </div>
        ) : favorites.size === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--spacing-md)", paddingTop: 64, color: "var(--text-secondary)" }}>
            <Heart size={40} strokeWidth={1.5} />
            <span className="text-token-body">Nenhuma praia favoritada ainda.</span>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
            {favBeaches.map((b) => {
              const c = CONDITIONS[b.cond];
              const meta = BEACHES_META[b.beach];
              const h = b.hours?.[currentHour];
              return (
                <BeachCard
                  key={b.beach}
                  name={b.beach}
                  state={meta?.state}
                  country={meta?.country}
                  height={h?.height}
                  condition={b.cond}
                  label={c?.label}
                  onClick={() => goToBeach(b.beach)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
