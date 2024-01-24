// src/models/FilmCatalog.ts

import { Table, Column, Model, HasMany } from "sequelize-typescript";
import Film from "./Film";

@Table
class FilmCatalog extends Model {
  @Column
  name!: string;
  @Column
  genre!: string;
  @Column
  startDay!: string;
  @Column
  posterUrl!: string;
  @Column
  duration!: string;
  @HasMany(() => Film)
  films!: Film[];
}

export default FilmCatalog;
