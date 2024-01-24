import express from "express";
import filmRoute from "./filmRoute";
import theaterRoute from "./theaterRoute";

const routes = express.Router();

routes.use("/city", theaterRoute);
routes.use("/film", filmRoute);
export default routes;
