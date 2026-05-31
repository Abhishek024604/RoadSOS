import axios from "axios";
import { cache } from "../cache/nodeCache.js";

const overpassTags = {
  hospital: ['["amenity"="hospital"]', '["amenity"="clinic"]', '["amenity"="doctors"]'],
  trauma: ['["emergency"="trauma_centre"]', '["healthcare:speciality"="trauma"]'],
  police: ['["amenity"="police"]'],
  ambulance: ['["emergency"="ambulance_station"]'],
  towing: ['["shop"="car_repair"]', '["service"="vehicle_towing"]'],
  puncture: ['["shop"="tyres"]', '["shop"="car_repair"]'],
  pharmacy: ['["amenity"="pharmacy"]'],
  fuel: ['["amenity"="fuel"]']
};

const overpassEndpoints = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter"
];

export async function getNearbyServices({ lat, lng, categories, q }) {
  const key = `nearby:${lat}:${lng}:${categories.join(",")}:${q}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const source = await fetchOverpass({ lat, lng, categories });
  const query = q.toLowerCase();
  const services = source
    .filter((service) => categories.includes(service.type))
    .filter((service) => !query || `${service.name} ${service.address} ${service.type}`.toLowerCase().includes(query))
    .sort((a, b) => a.distanceKm - b.distanceKm);

  cache.set(key, services);
  return services;
}

async function fetchOverpass({ lat, lng, categories }) {
  const radius = 15000;
  const clauses = categories.flatMap((category) => overpassTags[category]?.map((tag) => `nwr${tag}(around:${radius},${lat},${lng});`) || []);
  if (!clauses.length) return [];

  const query = `[out:json][timeout:25];(${clauses.join("")});out center tags 250;`;
  const data = await requestOverpass(query);

  return (data.elements || []).map((element, index) => {
    const point = element.type === "node" ? { lat: element.lat, lon: element.lon } : element.center;
    if (!point?.lat || !point?.lon) return null;
    const type = inferType(element.tags || {});
    return {
      id: `osm-${element.id || index}`,
      name: element.tags?.name || element.tags?.["name:en"] || "",
      type,
      lat: point.lat,
      lng: point.lon,
      distanceKm: Number(distanceKm(lat, lng, point.lat, point.lon).toFixed(1)),
      status: element.tags?.opening_hours?.includes("24/7") ? "Open 24 hrs" : "",
      phone: element.tags?.phone || element.tags?.["contact:phone"] || "",
      address: element.tags?.["addr:full"] || [element.tags?.["addr:housenumber"], element.tags?.["addr:street"], element.tags?.["addr:city"], element.tags?.["addr:state"]].filter(Boolean).join(", "),
      openingHours: element.tags?.opening_hours || "",
      source: "OpenStreetMap"
    };
  }).filter(Boolean);
}

async function requestOverpass(query) {
  let lastError;

  for (const endpoint of overpassEndpoints) {
    try {
      const { data } = await axios.post(endpoint, new URLSearchParams({ data: query }).toString(), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "RoadSOS/1.0"
        },
        timeout: 30_000
      });
      return data;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

function inferType(tags) {
  if (tags.amenity === "hospital") return "hospital";
  if (tags.emergency === "trauma_centre" || tags["healthcare:speciality"] === "trauma") return "trauma";
  if (tags.amenity === "police") return "police";
  if (tags.emergency === "ambulance_station") return "ambulance";
  if (tags.amenity === "pharmacy") return "pharmacy";
  if (tags.amenity === "fuel") return "fuel";
  if (tags.shop === "tyres") return "puncture";
  return "towing";
}

function distanceKm(lat1, lon1, lat2, lon2) {
  const radius = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
