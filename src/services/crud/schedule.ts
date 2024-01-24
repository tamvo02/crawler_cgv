import { sequelize } from "../../models";
import City from "../../models/City";
import Schedule from "../../models/Schedule";
export async function createSchedule(
  date: string,
  theaterId: number
): Promise<any> {
  try {
    const city = await Schedule.create({
      date: date,
      theaterId: theaterId,
    });
    return city;
  } catch (error) {
    console.error("Error creating city:", error);
    return null;
  }
}
export async function findScheduleByDate(date: string, id: number) {
  try {
    const existingSchedule = await Schedule.findOne({
      where: { date: date, theaterId: id },
    });
    return existingSchedule;
  } catch (error) {
    throw error;
  }
}
