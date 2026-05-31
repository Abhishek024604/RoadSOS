import { useQuery } from "@tanstack/react-query";
import { getNearbyServices } from "../../services/api.js";
import { useRoadSosStore } from "../../store/useRoadSosStore.js";

export function useNearbyServices() {
  const location = useRoadSosStore((state) => state.location);
  const activeCategories = useRoadSosStore((state) => state.activeCategories);
  const query = useRoadSosStore((state) => state.query);

  // Round to 3 decimal places (~110 meters) to aggressively reduce API calls and maximize caching
  const roundedLat = location?.lat ? Number(location.lat.toFixed(3)) : null;
  const roundedLng = location?.lng ? Number(location.lng.toFixed(3)) : null;

  return useQuery({
    queryKey: ["nearby", roundedLat, roundedLng, activeCategories, query],
    queryFn: () => getNearbyServices({
      lat: roundedLat,
      lng: roundedLng,
      categories: activeCategories,
      query
    }),
    select: (data) => {
      if (!location?.lat || !location?.lng) return data;
      // Recalculate precise distances based on exact live location
      return data.map((service) => ({
        ...service,
        distanceKm: Number(distanceKm(location.lat, location.lng, service.lat, service.lng).toFixed(1))
      })).sort((a, b) => a.distanceKm - b.distanceKm);
    },
    enabled: Boolean(roundedLat && roundedLng),
    retry: 0
  });
}

function distanceKm(lat1, lon1, lat2, lon2) {
  const radius = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
