import { serverClient } from "~/app/_trpc/serverClient";
import Post from "./Post";

export default async function PostList() {
  const posts = await serverClient.getPosts();

  if (!posts) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-8 px-8 md:px-0 pb-16">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}
