import { sequelize } from "../../models";
import City from "../../models/City";
export async function createCity(cityName: string): Promise<any> {
  try {
    const city = await City.create({ name: cityName });

    return city;
  } catch (error) {
    console.error("Error creating city:", error);
    return null;
  }
}
