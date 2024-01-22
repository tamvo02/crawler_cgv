// src/models/Theater.ts
import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  HasMany,
  Unique,
} from "sequelize-typescript";
import City from "./City";
import SChedule from "./Schedule";

@Table
class Theater extends Model {
  @Unique
  @Column
  name!: string;

  @ForeignKey(() => City)
  @Column
  cityId!: number;

  @BelongsTo(() => City)
  city!: City;

  @HasMany(() => SChedule)
  days!: SChedule[];
}

export default Theater;
