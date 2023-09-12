import { Response } from "express";
import { AccessTokenPayload } from "./Tokens";

interface AppContext {
  res: Response<any, Record<string, any>>;
  accessToken?: string;
  refreshToken?: string;
  tokenPayload?: AccessTokenPayload;
}

export default AppContext;
