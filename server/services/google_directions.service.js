import axios from "axios";

export async function getRoute({ from, to }) {
  const [fromLng, fromLat] = String(from || "").split(",").map(Number);
  const [toLng, toLat] = String(to || "").split(",").map(Number);

  if (![fromLng, fromLat, toLng, toLat].every(Number.isFinite)) {
    return null;
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_MAPS_API_KEY is missing");

  try {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${fromLat},${fromLng}&destination=${toLat},${toLng}&key=${apiKey}`;
    const { data } = await axios.get(url, { timeout: 10000 });
    
    const route = data.routes?.[0];
    if (route && route.legs?.[0]) {
      const leg = route.legs[0];
      const encodedPolyline = route.overview_polyline?.points;
      
      return {
        distanceKm: Number((leg.distance.value / 1000).toFixed(1)),
        etaMinutes: Math.max(1, Math.ceil(leg.duration.value / 60)),
        geometry: encodedPolyline ? decodePolyline(encodedPolyline) : []
      };
    }
  } catch (err) {
    console.error("Google Directions error:", err.message);
    return null;
  }
  return null;
}

// Decodes Google's encoded polyline string into an array of [lng, lat] coordinates
// format matches GeoJSON LineString coordinates
function decodePolyline(str, precision = 5) {
  let index = 0, lat = 0, lng = 0, coordinates = [];
  let shift = 0, result = 0, byte = null, latitude_change, longitude_change;
  const factor = Math.pow(10, precision);

  while (index < str.length) {
    byte = null;
    shift = 0;
    result = 0;
    do {
      byte = str.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));
    shift = result = 0;
    do {
      byte = str.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += latitude_change;
    lng += longitude_change;
    coordinates.push([lng / factor, lat / factor]); // note: [lng, lat] for GeoJSON
  }
  return coordinates;
}
