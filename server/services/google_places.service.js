import axios from "axios";
import { cache } from "../cache/nodeCache.js";

const categoryMapping = {
  hospital: { type: "hospital" },
  trauma: { type: "hospital", keyword: "trauma" },
  police: { type: "police" },
  ambulance: { type: "hospital", keyword: "ambulance" },
  towing: { type: "car_repair", keyword: "towing" },
  puncture: { type: "car_repair", keyword: "tire repair" },
  pharmacy: { type: "pharmacy" },
  fuel: { type: "gas_station" }
};

export async function getNearbyServices({ lat, lng, categories, q }) {
  const key = `nearby-google:${lat}:${lng}:${categories.join(",")}:${q}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_MAPS_API_KEY is missing");

  const results = [];
  const query = q?.toLowerCase() || "";

  // Google Nearby Search API
  const promises = categories.map(async (category) => {
    const mapping = categoryMapping[category];
    if (!mapping) return [];

    try {
      const params = new URLSearchParams({
        location: `${lat},${lng}`,
        rankby: "distance",
        key: apiKey
      });
      if (mapping.type) params.append("type", mapping.type);
      if (mapping.keyword) params.append("keyword", mapping.keyword);

      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${params.toString()}`;
      const { data } = await axios.get(url, { timeout: 10000 });
      
      return (data.results || []).map((place) => ({
        id: `google-${place.place_id}`,
        name: place.name || "",
        type: category, // maintain original type for UI
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
        distanceKm: Number(distanceKm(lat, lng, place.geometry.location.lat, place.geometry.location.lng).toFixed(1)),
        status: place.business_status === "OPERATIONAL" ? (place.opening_hours?.open_now ? "Open Now" : "Closed") : "Closed",
        phone: "", // Basic Nearby Search doesn't return phone numbers, would need Details API
        address: place.vicinity || "",
        source: "Google Maps"
      }));
    } catch (err) {
      console.error(`Google Places error for ${category}:`, err.message);
      return [];
    }
  });

  const allServices = (await Promise.all(promises)).flat();
  
  // Deduplicate and filter
  const uniqueServices = [];
  const seenIds = new Set();
  
  for (const service of allServices) {
    if (!seenIds.has(service.id)) {
      if (!query || `${service.name} ${service.address} ${service.type}`.toLowerCase().includes(query)) {
        seenIds.add(service.id);
        uniqueServices.push(service);
      }
    }
  }
  
  uniqueServices.sort((a, b) => a.distanceKm - b.distanceKm);
  cache.set(key, uniqueServices, 3600); // cache for 1 hour

  return uniqueServices;
}

function distanceKm(lat1, lon1, lat2, lon2) {
  const radius = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
