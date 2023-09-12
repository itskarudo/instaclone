import "reflect-metadata";
import express from "express";
import dotenv from "dotenv-safe";
import { buildSchema } from "type-graphql";
import AuthResolver from "./resolvers/AuthResolver";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import appDataSource from "./appDataSource";
import AppContext from "./AppContext";
import cookieParser from "cookie-parser";
import AuthChecker from "./utils/AuthChecker";
import path from "path";
import PostResolver from "./resolvers/PostResolver";
import UserResolver from "./resolvers/UserResolver";

dotenv.config();

const main = async () => {
  try {
    await appDataSource.initialize();
    console.log("> Database initialized");
  } catch (e) {
    console.error("[!] failed to start database");
    console.error(e);
    process.exit(-1);
  }

  const app = express();

  app.use(cookieParser());
  app.use(express.json());

  app.use("/uploads", express.static(path.join(__dirname, "../uploads/")));

  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
    }),
  );

  const server = new ApolloServer<AppContext>({
    schema: await buildSchema({
      resolvers: [AuthResolver, PostResolver, UserResolver],
      validate: {
        forbidUnknownValues: false,
      },
      authChecker: AuthChecker,
    }),
    formatError: (err) => err,
  });

  await server.start();

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req, res }): Promise<AppContext> => ({
        res,
        accessToken: req.headers.authorization?.split(" ")[1],
        refreshToken: req.cookies["RefreshToken"],
      }),
    }),
  );

  app.listen(process.env.PORT, () => {
    console.log(`> Server running on port ${process.env.PORT}`);
  });
};

main();
