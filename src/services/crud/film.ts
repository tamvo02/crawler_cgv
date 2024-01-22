import { sequelize } from "../../models";
import City from "../../models/City";
import Film from "../../models/Film";
import Schedule from "../../models/Schedule";
export async function createFilm(
  scheduleId: number,
  name: string,
  showTime: string
): Promise<any> {
  try {
    const city = await Film.create({
      scheduleId: scheduleId,
      name: name,
      showTime: showTime,
    });
    return city;
  } catch (error) {
    console.error("Error creating city:", error);
    return null;
  }
}
