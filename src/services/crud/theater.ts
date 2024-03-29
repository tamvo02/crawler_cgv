import { sequelize } from "../../models";
import City from "../../models/City";
import Theater from "../../models/Theater";
export async function createTheater(
  cityName: string,
  cityId: number,
  url: string
): Promise<any> {
  try {
    const city = await Theater.create({
      name: cityName,
      cityId: cityId,
      url: url,
    });

    return city;
  } catch (error) {
    console.error("Error creating city:", error);
    return null;
  }
}
