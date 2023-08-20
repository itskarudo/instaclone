import jwt from "jsonwebtoken"

export const generateTokens = (userId: string, tokenVersion: number) => {
  const accessToken = jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "1m"
  });

  const refreshToken = jwt.sign({userId, tokenVersion}, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "30 days"
  });

  return {accessToken, refreshToken}
}

export const validateAccessToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {userId: string};
  } catch (e) {
    return null;
  }
}

export const validateRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as {userId: string, tokenVersion: number};
  } catch (e) {
    return null;
  }
}

export const decodeAccessToken = (token: string) => {
    return jwt.decode(token) as {userId: string};
}