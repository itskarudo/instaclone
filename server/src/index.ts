import "reflect-metadata";
import express from "express";
import dotenv from "dotenv-safe";
import { buildSchema } from "type-graphql";
import AuthResolver from "./resolvers/AuthResolver";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import appDataSource from "./appDataSource";

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

  app.use(express.json());

  app.use(cors());

  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [AuthResolver],
      validate: {
        forbidUnknownValues: false,
      },
    }),
    formatError: (err) => err,
  });

  await server.start();

  app.use("/graphql", expressMiddleware(server));

  app.listen(process.env.PORT, () => {
    console.log(`> Server running on port ${process.env.PORT}`);
  });
};

main();
