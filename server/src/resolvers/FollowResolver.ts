import AppContext from "../AppContext";
import appDataSource from "../appDataSource";
import Follow from "../models/Follow";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";

@Resolver(() => Follow)
class FollowResolver {
  @Authorized()
  @Query(() => Boolean)
  async following(
    @Ctx() ctx: AppContext,
    @Arg("username") username: string,
  ): Promise<boolean> {
    const follow = await appDataSource.getRepository(Follow).findOne({
      where: {
        userId: username,
        followerId: ctx.tokenPayload!.username,
      },
    });

    return follow !== null;
  }

  @Authorized()
  @Mutation(() => Boolean)
  async follow(
    @Ctx() ctx: AppContext,
    @Arg("username") username: string,
  ): Promise<Boolean> {
    console.log(`following ${username}`);
    const follow = new Follow();
    follow.userId = username;
    follow.followerId = ctx.tokenPayload!.username;

    try {
      await appDataSource.manager.save(follow);
      return true;
    } catch (e) {
      return false;
    }
  }

  @Authorized()
  @Mutation(() => Boolean)
  async unfollow(
    @Ctx() ctx: AppContext,
    @Arg("username") username: string,
  ): Promise<Boolean> {
    console.log(`unfollowing ${username}`);
    const repo = appDataSource.getRepository(Follow);

    const follow = await repo.findOne({
      where: {
        userId: username,
        followerId: ctx.tokenPayload!.username,
      },
    });

    if (!follow) return false;

    try {
      await repo.remove(follow);
      return true;
    } catch (e) {
      return false;
    }
  }
}

export default FollowResolver;
