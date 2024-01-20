// src/models/City.ts
import { Table, Column, Model, HasMany, Unique } from "sequelize-typescript";
import Theater from "./Theater";

@Table
class City extends Model {
  @Unique
  @Column
  name!: string;

  @HasMany(() => Theater)
  theaters!: Theater[];
}

export default City;
