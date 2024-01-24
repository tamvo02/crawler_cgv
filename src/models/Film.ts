// src/models/Film.ts
import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import FilmCatalog from "./FilmCatalog";

import Schedule from "./Schedule";

import Showtime from "./Showtime";

@Table
class Film extends Model {
  @ForeignKey(() => Schedule)
  @Column
  scheduleId!: number;

  @ForeignKey(() => FilmCatalog)
  @Column
  filmCatalogId!: number;

  @BelongsTo(() => FilmCatalog)
  filmCatalog!: FilmCatalog;

  @Column
  name!: string;
  @Column
  poster!: string;
  @Column
  showTime!: string;
  @BelongsTo(() => Schedule)
  schedule!: Schedule;
}

export default Film;
