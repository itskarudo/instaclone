"use client";

import authContext from "@/contexts/authContext";
import { useContext } from "react";
import { HiEllipsisHorizontal } from "react-icons/hi2";

interface Props {
  username: string;
  fullName: string;
  bio: string;
}

const ProfileInfo: React.FC<Props> = ({ username, fullName, bio }) => {
  const auth = useContext(authContext);

  const ownProfile = username === auth.username;

  return (
    <div className="w-2/3">
      <div className="flex w-2/3 gap-4 items-center">
        <span className="text-xl">{username}</span>
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
            <button className="bg-blue-500 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-blue-600">
              Follow
            </button>
            <button className="bg-gray-200  text-sm font-bold px-4 py-2 rounded-xl hover:bg-gray-300">
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
          <span className="font-bold">20</span> posts
        </div>
        <div>
          <span className="font-bold">30</span> followers
        </div>
        <div>
          <span className="font-bold">50</span> following
        </div>
      </div>
      <div className="mt-4">
        <h3 className="font-bold text-sm">{fullName}</h3>
        <p className="text-sm">{bio}</p>
      </div>
    </div>
  );
};

export default ProfileInfo;
