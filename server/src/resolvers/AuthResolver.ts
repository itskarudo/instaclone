import { IsEmail, MinLength } from "class-validator";
import User from "../models/User";
import { Arg, Ctx, Field, InputType, Mutation, Resolver } from "type-graphql";
import argon2 from "argon2";
import appDataSource from "../appDataSource";
import { generateTokens, decodeRefreshToken } from "../utils/tokens";
import AppContext from "../AppContext";
import AppErrorCode from "../utils/ErrorCode";

@InputType()
class RegisterInput implements Partial<User> {
  @Field()
  @MinLength(4)
  username: string;

  @Field({ nullable: true })
  fullName?: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(8)
  password: string;
}

@Resolver()
class AuthResolver {
  @Mutation(() => String, { nullable: true })
  async refresh(@Ctx() ctx: AppContext): Promise<string | null> {
    if (!ctx.refreshToken) return null;

    const token = decodeRefreshToken(ctx.refreshToken);

    if (!token) return null;

    const user = await appDataSource.getRepository(User).findOneBy({
      username: token.username,
    });

    if (!user) return null;

    if (user.tokenVersion > token.tokenVersion) return null;

    const { accessToken, refreshToken } = generateTokens(
      user.username,
      user.profilePhotoURL,
      user.tokenVersion,
    );

    ctx.res.cookie("RefreshToken", refreshToken, {
      httpOnly: true,
    });

    return accessToken;
  }

  @Mutation(() => String)
  async login(
    @Ctx() ctx: AppContext,
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
  ) {
    const user = await appDataSource
      .getRepository(User)
      .createQueryBuilder("user")
      .where(
        "user.username = :usernameOrEmail OR user.email = :usernameOrEmail",
        { usernameOrEmail },
      )
      .getOne();

    if (!user) throw new Error(AppErrorCode.INVALID_LOGIN_CREDENTIALS);

    const isValid = await argon2.verify(user.password, password);

    if (!isValid) throw new Error(AppErrorCode.INVALID_LOGIN_CREDENTIALS);

    const { accessToken, refreshToken } = generateTokens(
      user.username,
      user.profilePhotoURL,
      user.tokenVersion,
    );

    ctx.res.cookie("RefreshToken", refreshToken, {
      httpOnly: true,
    });

    return accessToken;
  }

  @Mutation(() => User)
  async register(@Arg("data") data: RegisterInput): Promise<User> {
    const hashedPassword = await argon2.hash(data.password);

    const user = new User();
    user.username = data.username;
    user.fullName = data.fullName;
    user.email = data.email;
    user.password = hashedPassword;

    return appDataSource.manager.save(user);
  }
}

export default AuthResolver;
