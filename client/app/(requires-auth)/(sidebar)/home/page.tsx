"use client";
import Post from "@/components/post";
import { graphql } from "@/generated";
import { useQuery } from "urql";

const Home = () => {
  const query = graphql(`
    query Posts {
      posts {
        id
        caption
        photoURLs
        createdAt
        user {
          username
          profilePhotoURL
        }
      }
    }
  `);

  const [{ data, error }] = useQuery({ query });

  return (
    <div id="Home" className="flex justify-center p-5">
      <div className="flex w-3/4 gap-10">
        <div className="w-2/3">
          <div>STORIES</div>
          <div className="flex flex-col  items-center mt-5 gap-5">
            {data?.posts.map((post) => <Post key={post.id} post={post} />)}
          </div>
        </div>
        <div className="w-1/3">stuff here</div>
      </div>
    </div>
  );
};

export default Home;
