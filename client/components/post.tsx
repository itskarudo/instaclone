import {
  HiEllipsisHorizontal,
  HiOutlineBookmark,
  HiOutlineChatBubbleOvalLeft,
  HiOutlineHeart,
  HiOutlinePaperAirplane,
} from "react-icons/hi2";
import Image from "next/image";
import { PostsQuery } from "@/generated/graphql";
import { postImageURL, profileImageURL } from "@/utils/paths";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";

dayjs.extend(relativeTime);

interface Props {
  post: PostsQuery["posts"][0];
}

const Post: React.FC<Props> = ({ post }) => {
  return (
    <div className="w-3/5 flex flex-col gap-1 border-b-[1px] border-gray-200 border-solid">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src={profileImageURL(post.user.profilePhotoURL)}
            alt="profile pic"
            width={35}
            height={35}
            className="rounded-full"
          />
          <Link href={post.user.username}>
            <span className="text-sm font-bold">{post.user.username}</span>
          </Link>
          <span className="text-sm text-gray-500">
            • {dayjs(post.createdAt).fromNow()}
          </span>
        </div>
        <button>
          <HiEllipsisHorizontal className="text-2xl" />
        </button>
      </div>
      <div className="mt-4 mb-3 rounded overflow-hidden border-[1px] border-gray-100 border-solid">
        <Image
          src={postImageURL(post.photoURL)}
          alt="post image"
          width={500}
          height={500}
          className="w-full"
        />
      </div>
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <button>
            <HiOutlineHeart className="text-2xl hover:text-gray-500" />
          </button>
          <button>
            <HiOutlineChatBubbleOvalLeft className="text-2xl hover:text-gray-500" />
          </button>
          <button>
            <HiOutlinePaperAirplane className="text-2xl hover:text-gray-500" />
          </button>
        </div>
        <div>
          <button>
            <HiOutlineBookmark className="text-2xl hover:text-gray-500" />
          </button>
        </div>
      </div>
      <div>
        <span className="text-sm font-bold">41 likes</span>
      </div>
      <div className="text-sm">
        <span className="font-bold mr-1">{post.user.username}</span>{" "}
        {post.caption}
      </div>
      <div>
        <button>
          <span className="text-sm text-gray-500 block my-1">
            View all 2 comments
          </span>
        </button>
        <textarea
          placeholder="Add a comment..."
          className="text-sm w-full focus:outline-none resize-none"
        ></textarea>
      </div>
    </div>
  );
};

export default Post;
