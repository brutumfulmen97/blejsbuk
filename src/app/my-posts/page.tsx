import { Suspense } from "react";
import { serverClient } from "../_trpc/serverClient";
import { PostsSkeleton } from "~/components/PostSkeleton";
import Post from "~/components/Post";

const page = async ({}) => {
  const posts = await serverClient.getPostsByUser();

  if (!posts) {
    return <PostsSkeleton />;
  }

  return (
    <div className="pt-12">
      <h1 className="text-2xl text-slate-200 font-bold mb-12">
        Here are your posts...
      </h1>
      <Suspense fallback={<PostsSkeleton />}>
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </Suspense>
    </div>
  );
};

export default page;
