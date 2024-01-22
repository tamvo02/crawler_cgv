// src/models/Film.ts
import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import Schedule from "./Schedule";
import Day from "./Schedule";
import Showtime from "./Showtime";

@Table
class Film extends Model {
  @ForeignKey(() => Day)
  @Column
  scheduleId!: number;
  @Column
  name!: string;
  @Column
  showTime!: string;
  @BelongsTo(() => Schedule)
  schedule!: Schedule;

  @HasMany(() => Showtime)
  times!: Showtime[];
}

export default Film;
