import AppContext from "src/AppContext";
import appDataSource from "../appDataSource";
import Post from "../models/Post";
import { decodeAccessToken } from "../utils/tokens";
import { Authorized, Ctx, FieldResolver, Query, Resolver, Root } from "type-graphql";
import User from "../models/User";
import AppErrorCode from "../utils/ErrorCode";

@Resolver(() => Post)
class PostResolver {

  @Authorized()
  @Query(() => [Post])
  async posts(@Ctx() ctx: AppContext): Promise<Post[]> {

    const {userId} = decodeAccessToken(ctx.accessToken!);

    const posts = await appDataSource.getRepository(Post)
      .createQueryBuilder("post")
      .where("post.userId = :userId", {userId})
      .getMany();
      
    return posts;
  }

  @Authorized()
  @FieldResolver()
  async user(@Root() post: Post): Promise<User> {

    const user = await appDataSource.getRepository(User)
      .createQueryBuilder("user")
      .where("user.id = :userId", {userId: post.userId})
      .getOne();

    if (!user) throw new Error(AppErrorCode.INTERNAL_SERVER_ERROR);

    return user;
  }

}

export default PostResolver;