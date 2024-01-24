// src/db.ts
import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import City from "./City";

import Film from "./Film";
import Theater from "./Theater";

import Showtime from "./Showtime";
import SChedule from "./Schedule";
import FilmCatalog from "./FilmCatalog";

const sequelizeOptions: SequelizeOptions = {
  username: "myuser",
  password: "yourpassword",
  database: "test",
  host: "localhost",
  dialect: "postgres",
};
const sequelize = new Sequelize(sequelizeOptions);

sequelize.addModels([City, Theater, SChedule, FilmCatalog, Film]);

export { sequelize };
