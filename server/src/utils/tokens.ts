import jwt from "jsonwebtoken"

export const generateTokens = (username: string, tokenVersion: number) => {
  const accessToken = jwt.sign({username}, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "1m"
  });

  const refreshToken = jwt.sign({username, tokenVersion}, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "30 days"
  });

  return {accessToken, refreshToken}
}

export const validateAccessToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {username: string};
  } catch (e) {
    return null;
  }
}

export const validateRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as {username: string, tokenVersion: number};
  } catch (e) {
    return null;
  }
}

export const decodeAccessToken = (token: string) => {
    return jwt.decode(token) as {username: string};
}