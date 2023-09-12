import Post from "../models/Post";
import appDataSource from "../appDataSource";
import User from "../models/User";
import { Arg, FieldResolver, Query, Resolver, Root } from "type-graphql";

@Resolver(() => User)
class UserResolver {
  @Query(() => User, { nullable: true })
  async user(@Arg("username") username: string): Promise<User | null> {
    const user = await appDataSource
      .getRepository(User)
      .createQueryBuilder("user")
      .where("user.username = :username", { username })
      .getOne();

    return user;
  }

  @FieldResolver()
  async posts(@Root() user: User): Promise<Post[]> {
    const posts = await appDataSource
      .getRepository(Post)
      .createQueryBuilder("post")
      .where("post.ownerUsername = :username", { username: user.username })
      .getMany();

    return posts;
  }
}

export default UserResolver;
