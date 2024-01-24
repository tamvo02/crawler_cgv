import express, { NextFunction } from "express";
import crawlService from "../services/crawlData";
import { createSchedule, findScheduleByDate } from "../services/crud/schedule";
import theaterService from "../services/theater";
import { BaseController } from "./baseController";

export default class FilmController extends BaseController {
  constructor() {
    super();
  }
  public theaterService1 = new theaterService();

  public availableFilm = async (
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) => {
    try {
      // const data = await this.theaterService1.getAllCityandTheater();
      console.log("data");
      res.status(200).json({ success: true });
    } catch (err) {
      console.log(err);
      next(err);
    }
  };
}
