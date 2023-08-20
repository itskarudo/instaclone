import { DataSource } from "typeorm";
import User from "./models/User";
import Post from "./models/Post";

const appDataSource = new DataSource({
  type: "postgres",
  database: "instaclone",
  username: "admin",
  logging: true,
  synchronize: true,
  entities: [User, Post],
});

export default appDataSource;
