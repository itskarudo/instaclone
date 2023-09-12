import AppContext from "src/AppContext";
import appDataSource from "../appDataSource";
import Post from "../models/Post";
import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import User from "../models/User";
import AppErrorCode from "../utils/ErrorCode";

@Resolver(() => Post)
class PostResolver {
  @Authorized()
  @Query(() => [Post])
  async posts(@Ctx() ctx: AppContext): Promise<Post[]> {
    const posts = await appDataSource
      .getRepository(Post)
      .createQueryBuilder("post")
      .where("post.ownerUsername = :username", {
        username: ctx.tokenPayload!.username,
      })
      .orderBy("post.createdAt", "DESC")
      .getMany();

    return posts;
  }

  @Authorized()
  @FieldResolver()
  async user(@Root() post: Post): Promise<User> {
    const user = await appDataSource
      .getRepository(User)
      .createQueryBuilder("user")
      .where("user.username = :username", { username: post.ownerUsername })
      .getOne();

    if (!user) throw new Error(AppErrorCode.INTERNAL_SERVER_ERROR);

    return user;
  }

  @Authorized()
  @Mutation(() => Post)
  async createPost(
    @Ctx() ctx: AppContext,
    @Arg("caption") caption: string,
    @Arg("photoURLs", () => [String]) photoURLS: string[],
  ) {
    const post = new Post();

    post.ownerUsername = ctx.tokenPayload!.username;
    post.photoURLs = photoURLS;
    post.caption = caption;

    return await appDataSource.manager.save(post);
  }
}

export default PostResolver;
