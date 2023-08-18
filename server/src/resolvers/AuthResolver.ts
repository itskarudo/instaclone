import { IsEmail, MinLength } from "class-validator";
import User from "../models/User";
import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import argon2 from "argon2";
import appDataSource from "../appDataSource";

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
  @Query(() => String)
  async test() {
    return "test";
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
