import axios from "axios";
import { Request, Response } from "express";
import cheerio from "cheerio";
import puppeteer from "puppeteer";
import { createCity } from "./crud/city";
import { createTheater } from "./crud/theater";
import moment from "moment";
import { createSchedule } from "./crud/schedule";
import { createFilm, createFilmCatalog, findFilmCatalog } from "./crud/film";
import { createShowtime } from "./crud/showTime";
import FilmCatalog from "../models/FilmCatalog";
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
  public async crawlDataFilmAvailable() {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      // Navigate to the website
      await page.goto("https://www.cgv.vn/default/movies/now-showing.html");

      // Wait for JavaScript to execute
      await page.waitForTimeout(5000); // Adjust the time as needed

      // Get the content after JavaScript execution
      const content = await page.content();
      // console.log(content);
      const cities = this.extractAvailableFilm(content);

      await browser.close();
    } catch (error) {
      console.error(error);
    }
  }
  public async extractCities(html: string) {
    const $ = cheerio.load(html);
    let flag: number = 0;
    // Select city spans and extract their IDs and names
    const cityPromises = $("span[id^='cgv_city_']")
      .map(async (_, element) => {
        const idMatches = $(element).attr("id")?.match(/\d+/);
        const cityId = idMatches ? parseInt(idMatches[0]) : -1; // Default to -1 if no match
        const cityName = $(element).text();

        if (cityId !== -1 && cityName) {
          const city = await createCity(cityName);
          const theater = await this.extractTheater(
            html,
            $(element).attr("id"),
            city.dataValues.id
          );
        }
      })
      .get();

    await Promise.all(cityPromises);
  }
  public async extractAvailableFilm(html: string) {
    const $ = cheerio.load(html);
    let flag: number = 0;
    // Select city spans and extract their IDs and names
    const cityPromises = $(".film-lists")
      .map(async (_, element) => {
        const filmAtribute: any = [];
        const filmName = $(element).find(".product-name a").text();
        const posterUrl: any = $(element)
          .find(".product-images a img")
          .attr("src");
        // console.log("idMatches", idMatches);
        const idMatchess = $(element)
          .find(".cgv-movie-info .cgv-info-normal")
          .map((_, subelement) => {
            const idMatchesss = $(subelement).text().trim();
            filmAtribute.push(idMatchesss);
          });
        console.log("idMatches:", filmName, filmAtribute, posterUrl);
        await createFilmCatalog(
          filmName,
          posterUrl,
          filmAtribute[1],
          filmAtribute[0],
          filmAtribute[2]
        );
      })
      .get();

    await Promise.all(cityPromises);
  }

  public async extractTheater(html: string, cityId: any, id: any) {
    const $ = cheerio.load(html);

    const cityTheaters: any[] = [];
    console.log("cityId:", cityId);

    // Select li elements with class starting with 'cgv_city_{cityId}'
    const theaterPromise = $(`li.${cityId} span[id^='cgv_site_']`).map(
      async (_, spanElement) => {
        const theaterIdMatches = $(spanElement).attr("id")?.match(/\d+/);
        const theaterId = theaterIdMatches ? theaterIdMatches : "";
        const theaterName = $(spanElement).text().trim();

        const onclickValue = $(spanElement).attr("onclick");
        const linkMatch = onclickValue?.match(/site\('(.+)',this\)/);
        const link = linkMatch ? linkMatch[1] : "";
        if (theaterId && theaterName) {
          // const theater = await createTheater(theaterName); // Assuming you have a createTheater function
          console.log(` Theater ${theaterName}`);
          const theater = await createTheater(theaterName, parseInt(id), link);
          // await this.extractScheduleEachTheater(
          //   html,
          //   $(spanElement).attr("id"),
          //   theater.dataValues.id,
          //   link
          // );
        }
      }
    );
    await Promise.all(theaterPromise);

    return cityTheaters;
  }
  // public async extractScheduleEachTheater(
  //   html: string,
  //   theaterId: any,
  //   id: any,
  //   link: string
  // ) {
  //   const currentDate = moment(); // Get the current date once
  //   const scheduleIds: any = [];

  //   for (let i = 0; i < 7; i++) {
  //     try {
  //       const targetDate = currentDate.clone().add(i, "days");
  //       const formattedDate = targetDate.format("YYYYMMDD");

  //       // Create Schedule
  //       const dataSchedule = await createSchedule(targetDate.toDate(), id);

  //       // Make Axios Request
  //       const responses = await axios.post(link, {
  //         selecteddate: formattedDate,
  //       });

  //       const $ = cheerio.load(responses.data);
  //       const listFilm: any = [];

  //       const filmListPromises = $(".film-list").map(async (_, element) => {
  //         const filmName = $(element).find(".film-label h3 a").attr("title");
  //         const $1 = cheerio.load(element);
  //         listFilm.push(filmName);
  //         const showTime: any = [];
  //         $1(element)
  //           .find(".film-showtimes ul li a span")
  //           .map((index, timeElement) => {
  //             const showtime = $1(timeElement).text().trim();
  //             showTime.push(showtime);
  //           });
  //         if (filmName) {
  //           await createFilm(
  //             dataSchedule.dataValues.id,
  //             filmName,
  //             showTime.toString()
  //           );
  //         }
  //         // Create Film based on Schedule ID
  //       });
  //       // console.log(listFilm);
  //       // Wait for all filmListPromises to resolve
  //       await Promise.all(filmListPromises);
  //     } catch (error) {
  //       console.error("Error in the loop:", error);
  //       // Handle the error as needed
  //     }
  //   }

  //   // });
  // }
  public async extractScheduleEachTheater(
    scheduleId: any,
    date: string,
    link: string
  ) {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      // Navigate to the website
      await page.goto(link);

      // Wait for JavaScript to execute
      await page.waitForTimeout(5000); // Adjust the time as needed

      // Get the content after JavaScript execution
      const content = await page.content();
      // console.log(content);

      await browser.close();
      // const responses = await axios.post(link, {
      //   selecteddate: date,
      // });

      // Extract and log the result from the response
      // const result = responses.data;
      console.log(content);

      // Further processing based on the result (similar to your client-side code)
      if (!content.includes("film-list")) {
        console.log("No schedules available!");
      } else {
        const $ = cheerio.load(content);

        // const listFilm = [];

        const filmListPromises = $(".film-list").map(async (_, element) => {
          const filmName = $(element).find(".film-label h3 a").attr("title");
          const posterImg = $(element)
            .find(".film-left .film-poster a img")
            .attr("src");
          console.log("Poster Source:", posterImg);
          const showTime: any = [];
          $(element)
            .find(".film-showtimes ul li a span")
            .map((index, timeElement) => {
              const showtime = $(timeElement).text().trim();
              showTime.push(showtime);
            });
          console.log(filmName, showTime);
          if (filmName && posterImg) {
            const filmCatalogData = await findFilmCatalog(filmName);
            if (filmCatalogData) {
              await createFilm(
                scheduleId,
                filmName,
                showTime.toString(),
                posterImg,
                filmCatalogData.dataValues.id
              );
            }
          }
          // Create Film based on Schedule ID
        });

        // Wait for all filmListPromises to resolve
        await Promise.all(filmListPromises);
      }
    } catch (error: any) {
      console.error("Error:", error.message);
    }
  }
}
