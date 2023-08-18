import { DataSource } from "typeorm";
import User from "./models/User";

const appDataSource = new DataSource({
  type: "postgres",
  database: "instaclone",
  username: "admin",
  logging: true,
  synchronize: true,
  entities: [User],
});

export default appDataSource;
