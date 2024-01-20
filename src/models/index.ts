// src/db.ts
import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import City from "./City";

import Day from "./Day";
import Film from "./Film";
import Theater from "./Theater";
import Time from "./Time";

const sequelizeOptions: SequelizeOptions = {
  username: "myuser",
  password: "yourpassword",
  database: "test",
  host: "localhost",
  dialect: "postgres",
};
const sequelize = new Sequelize(sequelizeOptions);

sequelize.addModels([City, Theater, Day, Film, Time]);

export { sequelize };
