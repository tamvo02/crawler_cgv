import { Router } from "express";
import TheaterController from "../controllers/theaterController";

const theaterRoute = Router();
const theaterController = new TheaterController();

theaterRoute.get("/city", theaterController.crawlData);
export default theaterRoute;
