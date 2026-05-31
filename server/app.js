import "dotenv/config";
import express from "express";
import cors from "cors";
import { nearbyRouter } from "./routes/nearby.routes.js";
import { routeRouter } from "./routes/route.routes.js";
import { searchRouter } from "./routes/search.routes.js";
import { cacheRouter } from "./routes/cache.routes.js";

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use("/api/nearby", nearbyRouter);
app.use("/api/route", routeRouter);
app.use("/api/search", searchRouter);
app.use("/api/cache", cacheRouter);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "RoadSOS API" });
});

app.listen(port, () => {
  console.log(`RoadSOS API running on http://127.0.0.1:${port}`);
});
