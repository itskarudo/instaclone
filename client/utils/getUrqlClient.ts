import { graphql } from "@/generated";
import { authExchange } from "@urql/exchange-auth";
import { registerUrql } from "@urql/next/rsc";
import { cacheExchange, createClient, fetchExchange, gql } from "urql";

const makeClient = () => {

  return createClient({
    url: "http://localhost:5000/graphql",
    fetchOptions: {
      credentials: "include"
    },
    requestPolicy: "network-only",
    exchanges: [cacheExchange, authExchange(async (utils) => {

      return {
        addAuthToOperation(operation) {
          const accessToken = localStorage.getItem("access_token");

          if (!accessToken) return operation;

          return utils.appendHeaders(operation, {
            Authorization: `Bearer ${accessToken}`
          })
        },
        didAuthError(error, _operation) {
          return error.graphQLErrors.some(e => e.message.startsWith('Access denied!'))
        },
        async refreshAuth() {

          const mutation = graphql(`
            mutation Refresh {
              refresh
            }
          `)

          const {data, error} = await utils.mutate(mutation, {});
          if (error || !data || !data.refresh) return;

          localStorage.setItem("access_token", data.refresh);

        },
      }
    }), fetchExchange],
  });
};

const {getClient: getUrqlClient} = registerUrql(makeClient);

export default getUrqlClient;