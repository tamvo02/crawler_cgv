// src/index.ts
import express from "express";
import bodyParser from "body-parser";
import { sequelize } from "./models";
import routes from "./routers";
import crawlService from "./services/crawlData";

const app = express();
const port = 3000;
const crawler = new crawlService();
// app.use();
app.use(bodyParser.json());
sequelize.sync({ force: true });
// sequelize.sync();
crawler.crawlData();
app.use("/api/", routes);
app.get("/", (req, res) => {
  res.send("Hello, Sequelize with TypeScript!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
