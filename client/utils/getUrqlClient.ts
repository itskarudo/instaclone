import { graphql } from "@/generated";
import { authExchange } from "@urql/exchange-auth";
import { registerUrql } from "@urql/next/rsc";
import { cacheExchange, createClient, fetchExchange } from "@urql/core";
import { SERVER_BASE_URL } from "./paths";

const makeClient = () => {

  const isServer = typeof window === 'undefined'

  return createClient({
    url: `${SERVER_BASE_URL}/graphql`,
    fetchOptions: {
      credentials: "include",
      cache: "no-store"
    },
    exchanges: [cacheExchange, authExchange(async (utils) => {

      return {
        addAuthToOperation(operation) {
          if (isServer) return operation;
          const accessToken = localStorage.getItem("access_token");

          if (!accessToken) return operation;

          return utils.appendHeaders(operation, {
            Authorization: `Bearer ${accessToken}`
          })
        },
        didAuthError(error, _operation) {
          return !isServer && error.graphQLErrors.some(e => e.message.startsWith('Access denied!'))
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