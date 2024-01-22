import { sequelize } from "../../models";
import City from "../../models/City";
import Schedule from "../../models/Schedule";
import Showtime from "../../models/Showtime";
export async function createShowtime(
  filmId: number,
  startTime: string
): Promise<any> {
  try {
    const city = await Showtime.create({
      filmId: filmId,
      startTime: startTime,
    });
    return city;
  } catch (error) {
    console.error("Error creating city:", error);
    return null;
  }
}
