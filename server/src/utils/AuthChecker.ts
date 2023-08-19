import AppContext from "src/AppContext";
import { AuthCheckerInterface, ResolverData } from "type-graphql";
import {validateAccessToken} from "../utils/tokens"

class AuthChecker implements AuthCheckerInterface<AppContext> {
  async check({context}: ResolverData<AppContext>, _: string[]): Promise<boolean> {

    if (!context.accessToken) return false

    if (!validateAccessToken(context.accessToken)) return false;

    return true;

  }
}

export default AuthChecker;