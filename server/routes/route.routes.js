import { Router } from "express";
import { routeController } from "../controllers/route.controller.js";

export const routeRouter = Router();
routeRouter.get("/", routeController);
