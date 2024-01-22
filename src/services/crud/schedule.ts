import { sequelize } from "../../models";
import City from "../../models/City";
import Schedule from "../../models/Schedule";
export async function createSchedule(
  weekday: string,
  date: Date,
  theaterId: number
): Promise<any> {
  try {
    const city = await Schedule.create({
      weekday: weekday,
      date: date,
      theaterId: theaterId,
    });
    return city;
  } catch (error) {
    console.error("Error creating city:", error);
    return null;
  }
}
