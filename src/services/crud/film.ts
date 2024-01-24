import { sequelize } from "../../models";
import City from "../../models/City";
import Film from "../../models/Film";
import FilmCatalog from "../../models/FilmCatalog";
import Schedule from "../../models/Schedule";
export async function createFilm(
  scheduleId: number,
  name: string,
  showTime: string,
  posterUrl: string,
  filmCatalogId: number
): Promise<any> {
  try {
    const city = await Film.create({
      scheduleId: scheduleId,
      name: name,
      showTime: showTime,
      poster: posterUrl,
      filmCatalogId: filmCatalogId,
    });
    return city;
  } catch (error) {
    console.error("Error creating city:", error);
    return null;
  }
}
export async function createFilmCatalog(
  name: string,
  posterUrl: string,
  duration: string,
  genre: string,
  startDate: string
): Promise<any> {
  try {
    const city = await FilmCatalog.create({
      name: name,

      genre: genre,

      startDay: startDate,

      posterUrl: posterUrl,

      duration: duration,
    });
    return city;
  } catch (error) {
    console.error("Error creating city:", error);
    return null;
  }
}
export async function findFilmCatalog(name: string) {
  try {
    const existingSchedule = await FilmCatalog.findOne({
      where: { name: name },
    });
    return existingSchedule;
  } catch (error) {
    throw error;
  }
}
