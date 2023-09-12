import AppContext from "src/AppContext";
import { AuthCheckerInterface, ResolverData } from "type-graphql";
import { decodeAccessToken } from "../utils/tokens";

class AuthChecker implements AuthCheckerInterface<AppContext> {
  async check(
    { context }: ResolverData<AppContext>,
    _: string[],
  ): Promise<boolean> {
    if (!context.accessToken) return false;

    const payload = decodeAccessToken(context.accessToken);
    if (!payload) return false;

    context.tokenPayload = payload;

    return true;
  }
}

export default AuthChecker;
