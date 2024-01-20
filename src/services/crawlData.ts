import axios from "axios";
import { Request, Response } from "express";
import cheerio from "cheerio";
import puppeteer from "puppeteer";
import { createCity } from "./crud/city";
import { createTheater } from "./crud/theater";
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
    const $ = cheerio.load(html);

    const cityTheaters: any[] = [];
    console.log(theaterId, id, link);
    // Select li elements with class starting with 'cgv_city_{cityId}'
    // $(`li.${cityId} span[id^='cgv_site_']`).map(async (_, spanElement) => {
    //   const theaterIdMatches = $(spanElement).attr("id")?.match(/\d+/);
    //   const theaterId = theaterIdMatches ? theaterIdMatches[0] : "";
    //   const theaterName = $(spanElement).text().trim();

    //   if (theaterId && theaterName) {
    //     // const theater = await createTheater(theaterName); // Assuming you have a createTheater function
    //     console.log(` Theater ${theaterName}`);
    //     await createTheater(theaterName, parseInt(id));
    //     // cityTheaters.push(theater);
    //   }
    // });

    return cityTheaters;
  }
}
