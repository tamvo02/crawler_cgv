import axios from "axios";
import { Request, Response } from "express";
import cheerio from "cheerio";
import puppeteer from "puppeteer";
import City from "../models/City";
import Theater from "../models/Theater";
import Schedule from "../models/Schedule";
import Film from "../models/Film";
import Showtime from "../models/Showtime";
import FilmCatalog from "../models/FilmCatalog";
export default class theaterService {
  public async getAllCityandTheater() {
    try {
      const cities = await City.findAll({
        include: [
          {
            model: Theater,
          },
        ],
      });

      return cities;
    } catch (error) {
      console.error(error);
    }
  }
  public async getCityandTheater(cityId: number) {
    try {
      const cityWithTheaters = await City.findOne({
        where: { id: cityId },
        include: [
          {
            model: Theater,
          },
        ],
      });

      return cityWithTheaters;
    } catch (error) {
      console.error(error);
    }
  }
  public async getScheduleOfCity(theaterId: number) {
    try {
      const cityWithTheaters = await Schedule.findOne({
        where: { id: theaterId },
        include: [
          {
            model: Film,
            include: [
              {
                model: FilmCatalog,
              },
            ],
          },
        ],
      });

      return cityWithTheaters;
    } catch (error) {
      console.error(error);
    }
  }
}
