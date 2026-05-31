import { Router } from "express";
import { nearbyController } from "../controllers/nearby.controller.js";

export const nearbyRouter = Router();

nearbyRouter.get("/", nearbyController);
nearbyRouter.get("/hospitals", (req, res) => nearbyController({ ...req, query: { ...req.query, categories: "hospital,trauma" } }, res));
nearbyRouter.get("/police", (req, res) => nearbyController({ ...req, query: { ...req.query, categories: "police" } }, res));
nearbyRouter.get("/ambulance", (req, res) => nearbyController({ ...req, query: { ...req.query, categories: "ambulance" } }, res));
nearbyRouter.get("/towing", (req, res) => nearbyController({ ...req, query: { ...req.query, categories: "towing" } }, res));
