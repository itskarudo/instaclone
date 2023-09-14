"use client";

import authContext from "@/contexts/authContext";
import { graphql } from "@/generated";
import { UserQuery } from "@/generated/graphql";
import getUrqlClient from "@/utils/getUrqlClient";
import { useContext, useEffect, useState } from "react";
import { HiEllipsisHorizontal } from "react-icons/hi2";

interface Props {
  profile: UserQuery["user"] & { username: string };
}

const fetchIsFollowing = graphql(`
  query Following($username: String!) {
    following(username: $username)
  }
`);

const followMutation = graphql(`
  mutation Follow($username: String!) {
    follow(username: $username)
  }
`);

const unfollowMutation = graphql(`
  mutation Unfollow($username: String!) {
    unfollow(username: $username)
  }
`);

const ProfileInfo: React.FC<Props> = ({ profile }) => {
  const client = getUrqlClient();
  const auth = useContext(authContext);
  const [isFollowing, setIsFollowing] = useState(false);

  const ownProfile = profile.username === auth.username;

  useEffect(() => {
    (async () => {
      if (auth.username !== null && !ownProfile) {
        const { data, error } = await client.query(fetchIsFollowing, {
          username: profile.username,
        });
        if (error || !data) return;
        setIsFollowing(data.following);
      }
    })();
  }, [auth, ownProfile]);

  const follow = async () => {
    await client.mutation(followMutation, { username: profile.username });
    setIsFollowing(true);
  };

  const unfollow = async () => {
    await client.mutation(unfollowMutation, { username: profile.username });
    setIsFollowing(false);
  };

  return (
    <div className="w-2/3">
      <div className="flex gap-4 items-center">
        <span className="text-xl">{profile.username}</span>
        {ownProfile ? (
          <>
            <button className="bg-gray-200  text-sm font-bold px-4 py-2 rounded-xl hover:bg-gray-300">
              Edit profile
            </button>
            <button className="bg-gray-200  text-sm font-bold px-4 py-2 rounded-xl hover:bg-gray-300">
              View archive
            </button>
            <button>
              <HiEllipsisHorizontal className="text-2xl" />
            </button>
          </>
        ) : (
          <>
            {isFollowing ? (
              <button
                className="bg-gray-200 text-sm font-bold px-4 py-2 rounded-xl hover:bg-gray-300"
                onClick={unfollow}
              >
                Following
              </button>
            ) : (
              <button
                className="bg-blue-500 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-blue-600"
                onClick={follow}
              >
                Follow
              </button>
            )}
            <button className="bg-gray-200 text-sm font-bold px-4 py-2 rounded-xl hover:bg-gray-300">
              Message
            </button>
            <button>
              <HiEllipsisHorizontal className="text-2xl" />
            </button>
          </>
        )}
      </div>
      <div className="flex gap-12 mt-6">
        <div>
          <span className="font-bold">{profile.posts.length}</span> posts
        </div>
        <div>
          <span className="font-bold">{profile.followersCount}</span> followers
        </div>
        <div>
          <span className="font-bold">{profile.followingCount}</span> following
        </div>
      </div>
      <div className="mt-4">
        <h3 className="font-bold text-sm">{profile.fullName ?? ""}</h3>
        <p className="text-sm">{profile.bio ?? ""}</p>
      </div>
    </div>
  );
};

export default ProfileInfo;
