import { Router } from "express";
import { cache } from "../cache/nodeCache.js";

export const cacheRouter = Router();
cacheRouter.get("/status", (_req, res) => {
  res.json({ keys: cache.keys().length, ready: true });
});
