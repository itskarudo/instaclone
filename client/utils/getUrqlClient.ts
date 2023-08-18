import { registerUrql } from "@urql/next/rsc";
import { cacheExchange, createClient, fetchExchange } from "urql";

const makeClient = () => {
  return createClient({
    url: "http://localhost:5000/graphql",
    exchanges: [cacheExchange, fetchExchange]
  });
};

const {getClient: getUrqlClient} = registerUrql(makeClient);

export default getUrqlClient;