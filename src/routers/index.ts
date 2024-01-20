import express from "express";
import theaterRoute from "./theaterRoute";

const routes = express.Router();

routes.use("/v1", theaterRoute);
export default routes;
