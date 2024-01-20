import express, { NextFunction } from "express";
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
      const data = await this.theaterService1.crawlDataCity();
      console.log(data);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  };
}
