// src/models/Day.ts
import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import Theater from "./Theater";
import Film from "./Film";

@Table
class Schedule extends Model {
  @ForeignKey(() => Theater)
  @Column
  theaterId!: number;

  @Column
  date!: string;

  @BelongsTo(() => Theater)
  theater!: Theater;

  @HasMany(() => Film)
  films!: Film[];
}

export default Schedule;
