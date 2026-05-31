import { getRoute } from "../services/google_directions.service.js";

export async function routeController(req, res) {
  const route = await getRoute({ from: req.query.from, to: req.query.to });
  res.json(route);
}
