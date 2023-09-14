import ProfileInfo from "@/components/profile-info";
import { graphql } from "@/generated";
import { UserQuery } from "@/generated/graphql";
import getUrqlClient from "@/utils/getUrqlClient";
import { profileImageURL } from "@/utils/paths";
import Image from "next/image";

const getProfile = async (username: string): Promise<UserQuery["user"]> => {
  const client = getUrqlClient();

  const query = graphql(`
    query User($username: String!) {
      user(username: $username) {
        fullName
        bio
        profilePhotoURL
        followersCount
        followingCount
        posts {
          id
          photoURLs
          caption
        }
      }
    }
  `);

  const { data } = await client.query(query, { username });

  return data?.user;
};

const Profile = async ({ params }: { params: { username: string } }) => {
  const profile = await getProfile(params.username);

  if (!profile) return null;

  return (
    <div className="flex flex-col items-center gap-10">
      <div className="flex w-3/5">
        <div className="flex-grow flex justify-center items-center">
          <div className="rounded-full overflow-hidden">
            <Image
              src={profileImageURL(profile.profilePhotoURL)}
              alt={`${params.username}'s profile picture`}
              width={150}
              height={150}
            />
          </div>
        </div>
        <ProfileInfo profile={{ ...profile, username: params.username }} />
      </div>
      <hr className="border-b-1px border-gray-300 border-solid w-3/5" />
      <div className="w-3/5">
        <div className="grid grid-cols-3 gap-1">
          {profile.posts.map((post) => (
            <div className="aspect-square" key={post.id}>
              <Image
                src={post.photoURLs[0]}
                alt={post.caption}
                width={400}
                height={400}
                className="object-cover object-center h-full"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
