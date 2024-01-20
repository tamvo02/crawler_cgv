// src/models/Film.ts
import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import Day from "./Day";
import Time from "./Time";

@Table
class Film extends Model {
  @ForeignKey(() => Day)
  @Column
  dayId!: number;

  @BelongsTo(() => Day)
  day!: Day;

  @HasMany(() => Time)
  times!: Time[];
}

export default Film;
