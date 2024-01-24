// src/index.ts
import express from "express";
import bodyParser from "body-parser";
import { sequelize } from "./models";
import routes from "./routers";
import crawlService from "./services/crawlData";
import * as cors from "cors";

const app = express();
const port = 3000;

app.use(cors.default());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const crawler = new crawlService();

sequelize.sync();
// sequelize.sync({ force: true });
// crawler.crawlData();
// crawler.crawlDataFilmAvailable();
app.use("/api/v1", routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
