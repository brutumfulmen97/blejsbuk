import { serverClient } from "~/app/_trpc/serverClient";
import Post from "./Post";

export default async function PostList() {
  const posts = await serverClient.getPosts();

  if (!posts) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}
