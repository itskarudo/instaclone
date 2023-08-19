import { Response } from "express";

interface AppContext {
  res: Response<any, Record<string, any>>;
  accessToken?: string;
  refreshToken?: string;
}

export default AppContext;