import Post from "../models/Post";
import appDataSource from "../appDataSource";
import User from "../models/User";
import { Arg, FieldResolver, Query, Resolver, Root } from "type-graphql";
import Follow from "../models/Follow";

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
      .orderBy("post.createdAt", "DESC")
      .getMany();

    return posts;
  }

  @FieldResolver()
  async postsCount(@Root() user: User): Promise<number> {
    return await appDataSource.getRepository(Post).count({
      where: {
        ownerUsername: user.username,
      },
    });
  }

  @FieldResolver()
  async followersCount(@Root() user: User): Promise<number> {
    return await appDataSource.getRepository(Follow).count({
      where: {
        userId: user.username,
      },
    });
  }

  @FieldResolver()
  async followingCount(@Root() user: User): Promise<number> {
    return await appDataSource.getRepository(Follow).count({
      where: {
        followerId: user.username,
      },
    });
  }
}

export default UserResolver;
