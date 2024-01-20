import axios from "axios";
import { Request, Response } from "express";
import cheerio from "cheerio";
import puppeteer from "puppeteer";
export default class theaterService {
  public async crawlDataCity() {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      // Navigate to the website
      await page.goto("https://www.cgv.vn/default/cinox/site/");

      // Wait for JavaScript to execute
      await page.waitForTimeout(5000); // Adjust the time as needed

      // Get the content after JavaScript execution
      const content = await page.content();
      console.log(content);

      await browser.close();
    } catch (error) {
      console.error(error);
    }
  }
}
