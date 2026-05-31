import axios from "axios";

export async function searchPlaces(query) {
  if (!query) return [];

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_MAPS_API_KEY is missing");

  try {
    const { data } = await axios.get("https://maps.googleapis.com/maps/api/place/textsearch/json", {
      params: { query, key: apiKey },
      timeout: 10000
    });
    
    return (data.results || []).slice(0, 6).map((place) => ({
      id: `google-${place.place_id}`,
      name: place.name || "",
      type: inferType(place),
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      distanceKm: null,
      etaMinutes: null,
      status: place.business_status === "OPERATIONAL" ? (place.opening_hours?.open_now ? "Open Now" : "Closed") : "",
      phone: "",
      address: place.formatted_address || "",
      source: "Google Maps"
    }));
  } catch (err) {
    console.error("Google Text Search error:", err.message);
    return [];
  }
}

function inferType(place) {
  const text = `${place.types?.join(" ") || ""} ${place.name || ""}`.toLowerCase();
  if (text.includes("police")) return "police";
  if (text.includes("pharmacy")) return "pharmacy";
  if (text.includes("gas_station") || text.includes("fuel")) return "fuel";
  if (text.includes("hospital")) return "hospital";
  if (text.includes("doctor") || text.includes("clinic") || text.includes("trauma")) return "trauma";
  if (text.includes("tire") || text.includes("puncture")) return "puncture";
  if (text.includes("car_repair") || text.includes("towing")) return "towing";
  return "unknown";
}
