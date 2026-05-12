import { useState, useEffect } from "react";
import { reverseGeocode } from "@/lib/geo";

const GEO_COORDS_KEY = "geo_coords";
const GEO_LABEL_KEY  = "geo_label";

function readCache() {
  try {
    const raw = localStorage.getItem(GEO_COORDS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function useGeolocation() {
  const [coords, setCoords] = useState(() => readCache());
  const [cityLabel, setCityLabel] = useState(() => localStorage.getItem(GEO_LABEL_KEY));
  const [status, setStatus] = useState(() => readCache() ? "granted" : "pending");

  useEffect(() => {
    if (!navigator.geolocation) {
      if (!readCache()) setStatus("denied");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const newCoords = { lat, lng };
        setCoords(newCoords);
        localStorage.setItem(GEO_COORDS_KEY, JSON.stringify(newCoords));

        const label = await reverseGeocode(lat, lng);
        setCityLabel(label);
        if (label) localStorage.setItem(GEO_LABEL_KEY, label);

        setStatus("granted");
      },
      () => {
        localStorage.removeItem(GEO_COORDS_KEY);
        localStorage.removeItem(GEO_LABEL_KEY);
        setCoords(null);
        setCityLabel(null);
        setStatus("denied");
      }
    );
  }, []);

  return { status, coords, cityLabel };
}
