import { Router } from "express";
import FilmController from "../controllers/filmController";

const filmRoute = Router();
const filmController = new FilmController();

filmRoute.get("/available", filmController.availableFilm);

export default filmRoute;
