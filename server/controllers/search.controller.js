import { searchPlaces } from "../services/google_search.service.js";

export async function searchController(req, res) {
  const results = await searchPlaces(req.query.q || "");
  res.json(results);
}
