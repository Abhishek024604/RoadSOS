import axios from "axios";

export async function getRoute({ from, to }) {
  const [fromLng, fromLat] = String(from || "").split(",").map(Number);
  const [toLng, toLat] = String(to || "").split(",").map(Number);

  if (![fromLng, fromLat, toLng, toLat].every(Number.isFinite)) {
    return null;
  }

  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=geojson`;
    const { data } = await axios.get(url, { timeout: 10_000 });
    const route = data.routes?.[0];
    if (route) {
      return {
        distanceKm: Number((route.distance / 1000).toFixed(1)),
        etaMinutes: Math.max(1, Math.ceil(route.duration / 60)),
        geometry: route.geometry.coordinates
      };
    }
  } catch {
    return null;
  }
  return null;
}
