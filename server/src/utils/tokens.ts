import jwt from "jsonwebtoken";
import { AccessTokenPayload, RefreshTokenPayload } from "src/Tokens";

export const generateTokens = (
  username: string,
  profilePicURL: string | null,
  tokenVersion: number,
) => {
  const accessToken = jwt.sign(
    { username, profilePicURL },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "1m",
    },
  );

  const refreshToken = jwt.sign(
    { username, tokenVersion },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "30 days",
    },
  );

  return { accessToken, refreshToken };
};

export const decodeAccessToken = (token: string) => {
  try {
    return jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!,
    ) as AccessTokenPayload;
  } catch (e) {
    return null;
  }
};

export const decodeRefreshToken = (token: string) => {
  try {
    return jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET!,
    ) as RefreshTokenPayload;
  } catch (e) {
    return null;
  }
};
