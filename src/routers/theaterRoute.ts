import { Router } from "express";
import TheaterController from "../controllers/theaterController";

const theaterRoute = Router();
const theaterController = new TheaterController();

theaterRoute.get("", theaterController.crawlData);
theaterRoute.post("/schedule", theaterController.findScheduleOfTheaterByDate);
theaterRoute.get("/:id", theaterController.findCItyrAndTheater);
export default theaterRoute;
