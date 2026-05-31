import axios from "axios";

export async function searchPlaces(query) {
  if (!query) return [];

  try {
    const { data } = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: { q: query, format: "jsonv2", limit: 6, addressdetails: 1 },
      headers: { "User-Agent": "RoadSOS/1.0" },
      timeout: 8_000
    });
    return data.map((place) => ({
      id: `nominatim-${place.place_id}`,
      name: place.name || place.display_name?.split(",")[0] || "",
      type: inferType(place),
      lat: Number(place.lat),
      lng: Number(place.lon),
      distanceKm: null,
      etaMinutes: null,
      status: "",
      phone: "",
      address: place.display_name || "",
      source: "OpenStreetMap"
    }));
  } catch {
    return [];
  }
}

function inferType(place) {
  const text = `${place.class || ""} ${place.type || ""} ${place.display_name || ""}`.toLowerCase();
  if (text.includes("police")) return "police";
  if (text.includes("pharmacy")) return "pharmacy";
  if (text.includes("fuel") || text.includes("gas station")) return "fuel";
  if (text.includes("hospital")) return "hospital";
  if (text.includes("clinic") || text.includes("trauma")) return "trauma";
  if (text.includes("tyre") || text.includes("tire") || text.includes("puncture")) return "puncture";
  if (text.includes("car_repair") || text.includes("towing")) return "towing";
  return "unknown";
}
