const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

export async function getNearbyServices({ lat, lng, categories, query }) {
  const params = new URLSearchParams({
    lat,
    lng,
    categories: categories.join(","),
    q: query || ""
  });
  const response = await fetch(`${API_BASE}/nearby?${params}`);
  if (!response.ok) throw new Error("Nearby API failed");
  return response.json();
}

export async function getRoute({ origin, destination }) {
  try {
    const params = new URLSearchParams({
      from: `${origin.lng},${origin.lat}`,
      to: `${destination.lng},${destination.lat}`
    });
    const response = await fetch(`${API_BASE}/route?${params}`);
    if (!response.ok) throw new Error("Route API failed");
    return await response.json();
  } catch {
    return null;
  }
}

export async function searchPlaces(query) {
  if (!query.trim()) return [];
  const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error("Search API failed");
  return response.json();
}
