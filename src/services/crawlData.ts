import axios from "axios";
import { Request, Response } from "express";
import cheerio from "cheerio";
import puppeteer from "puppeteer";
import { createCity } from "./crud/city";
import { createTheater } from "./crud/theater";
import moment from "moment";
import { createSchedule } from "./crud/schedule";
import { createFilm } from "./crud/film";
import { createShowtime } from "./crud/showTime";
export default class crawlService {
  public async crawlData() {
    try {
      const startTime = new Date();

      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      // Navigate to the website
      await page.goto("https://www.cgv.vn/default/cinox/site");

      // Wait for JavaScript to execute
      await page.waitForTimeout(5000); // Adjust the time as needed

      // Get the content after JavaScript execution
      const content = await page.content();
      // console.log(content);
      const cities = this.extractCities(content);
      console.log(cities);
      await browser.close();
      const endTime = new Date();
      const elapsedTime = endTime.getTime() - startTime.getTime();
      console.log(`CrawlData finished in ${elapsedTime / 1000} seconds`);
    } catch (error) {
      console.error(error);
    }
  }
  public async extractCities(html: string) {
    const $ = cheerio.load(html);

    // Select city spans and extract their IDs and names
    const cityPromises = $("span[id^='cgv_city_']")
      .map(async (_, element) => {
        const idMatches = $(element).attr("id")?.match(/\d+/);
        const cityId = idMatches ? parseInt(idMatches[0]) : -1; // Default to -1 if no match
        const cityName = $(element).text();

        // Add the city to the object
        if (cityId !== -1 && cityName) {
          const city = await createCity(cityName);
          const theater = await this.extractTheater(
            html,
            $(element).attr("id"),
            city.dataValues.id
          );

          console.log(city.dataValues.id);
        }
      })
      .get();

    await Promise.all(cityPromises);
  }

  public async extractTheater(html: string, cityId: any, id: any) {
    const $ = cheerio.load(html);

    const cityTheaters: any[] = [];
    console.log("cityId:", cityId);
    // Select li elements with class starting with 'cgv_city_{cityId}'
    $(`li.${cityId} span[id^='cgv_site_']`).map(async (_, spanElement) => {
      const theaterIdMatches = $(spanElement).attr("id")?.match(/\d+/);
      const theaterId = theaterIdMatches ? theaterIdMatches : "";
      const theaterName = $(spanElement).text().trim();

      const onclickValue = $(spanElement).attr("onclick");
      const linkMatch = onclickValue?.match(/site\('(.+)',this\)/);
      const link = linkMatch ? linkMatch[1] : "";
      if (theaterId && theaterName) {
        // const theater = await createTheater(theaterName); // Assuming you have a createTheater function
        console.log(` Theater ${theaterName}`);
        const theater = await createTheater(theaterName, parseInt(id));
        await this.extractScheduleEachTheater(
          html,
          $(spanElement).attr("id"),
          theater.dataValues.id,
          link
        );
        // cityTheaters.push(theater);
      }
    });

    return cityTheaters;
  }
  public async extractScheduleEachTheater(
    html: string,
    theaterId: any,
    id: any,
    link: string
  ) {
    console.log(theaterId, id, link);
    const dateArray = [];
    const today = moment();

    for (let i = 0; i < 7; i++) {
      dateArray.push(today.add(i, "days").format("YYYYMMDD"));
    }
    // console.log(dateArray);
    // dateArray.map(async (date) => {
    //   console.log(date);
    const fetchPromises = dateArray.map(async (date) => {
      // moment(date, "YYYYMMDD").format("dddd");
      const dataSchedule = await createSchedule(
        moment(date, "YYYYMMDD").format("dddd"),
        moment(date, "YYYYMMDD").toDate(),
        id
      );

      const responses = await axios.post(link, { selecteddate: date });
      const $ = cheerio.load(responses.data);
      if ($(".product-collateral.tabs.tabs-cgv-showtimes").length > 0) {
        const filmListPromises = $(".film-list").map(async (index, element) => {
          const filmName = $(element).find(".film-label h3 a").text().trim();

          // Extracting showtimes
          const showTime: any = [];
          const showtimePromises = $(element)
            .find(".film-showtimes ul li a span")
            .map((index, timeElement) => {
              const showtime = $(timeElement).text().trim();
              return showTime.push(showtime);
            })
            .get();

          const dataFilm = await createFilm(
            dataSchedule.dataValues.id,
            filmName,
            showTime.toString()
          );
          // console.log("Film Name:", filmName);
          // console.log("Showtimes:", showtimes);
          // console.log("------------------------");
        });

        // Wait for all filmListPromises to resolve
        await Promise.all(filmListPromises);
      }
    });

    try {
      await Promise.all(fetchPromises);
    } catch (error) {
      console.error("One or more requests failed:", error);
    }

    // });
  }
}
