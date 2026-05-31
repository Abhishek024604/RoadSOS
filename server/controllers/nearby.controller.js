import { z } from "zod";
import { getNearbyServices } from "../services/google_places.service.js";

const nearbySchema = z.object({
  lat: z.coerce.number(),
  lng: z.coerce.number(),
  categories: z.string().default("hospital,trauma,police,ambulance,towing,puncture,pharmacy,fuel"),
  q: z.string().optional().default("")
});

export async function nearbyController(req, res) {
  const parsed = nearbySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: "Valid lat and lng query parameters are required." });
  }

  const params = parsed.data;
  let categories = params.categories.split(",").filter(Boolean);
  
  if (categories.length === 0) {
    categories = ["hospital", "trauma", "police", "ambulance", "towing", "puncture", "pharmacy", "fuel"];
  }

  const services = await getNearbyServices({ ...params, categories });
  res.json(services);
}
