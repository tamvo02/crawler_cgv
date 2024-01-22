// src/models/Time.ts
import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import Film from "./Film";

@Table
class Showtime extends Model {
  @ForeignKey(() => Film)
  @Column
  filmId!: number;

  @BelongsTo(() => Film)
  film!: Film;

  @Column
  startTime!: string;
}

export default Showtime;
