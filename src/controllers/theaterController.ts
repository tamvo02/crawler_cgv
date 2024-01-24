import express, { NextFunction } from "express";
import crawlService from "../services/crawlData";
import { createSchedule, findScheduleByDate } from "../services/crud/schedule";
import theaterService from "../services/theater";
import { BaseController } from "./baseController";

export default class TheaterController extends BaseController {
  constructor() {
    super();
  }
  public theaterService1 = new theaterService();

  public crawlData = async (
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) => {
    try {
      const data = await this.theaterService1.getAllCityandTheater();
      // console.log(data);
      res.status(200).json({ success: true, data });
    } catch (err) {
      console.log(err);
      next(err);
    }
  };
  public findCItyrAndTheater = async (
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) => {
    const { id } = req.params;

    try {
      const data = await this.theaterService1.getCityandTheater(parseInt(id));
      // console.log(data);
      res.status(200).json({ success: true, data });
    } catch (err) {
      console.log(err);
      next(err);
    }
  };
  public findScheduleOfTheaterByDate = async (
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) => {
    const { id, date, link } = req.body;
    console.log({ id, date, link });
    const crawl = new crawlService();
    try {
      // Check if a schedule with the given date exists
      const existingSchedule = await findScheduleByDate(date, parseInt(id));

      if (existingSchedule) {
        console.log("Schedule exist!");
        // await crawl.extractScheduleEachTheater(
        //   existingSchedule.dataValues.id,
        //   date,
        //   link
        // );
        const data = await this.theaterService1.getScheduleOfCity(
          parseInt(existingSchedule.dataValues.id)
        );
        res.status(200).json({ success: true, data });
      } else {
        console.log("Not exist!");
        const newSchedule = await createSchedule(date, parseInt(id));
        await crawl.extractScheduleEachTheater(
          newSchedule.dataValues.id,
          date,
          link
        );
        const data = await this.theaterService1.getScheduleOfCity(
          parseInt(newSchedule.dataValues.id)
        );
        res.status(200).json({ success: true, data });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  };
}
