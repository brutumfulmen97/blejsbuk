import { Suspense } from "react";
import { serverClient } from "../_trpc/serverClient";
import { PostsSkeleton } from "~/components/PostSkeleton";
import Post from "~/components/Post";
import {
  LoginLink,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

const Page = async ({}) => {
  const { isAuthenticated, getUser } = await getKindeServerSession();
  const user = await getUser();

  if (!isAuthenticated || !user) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-8">
        This page is protected, please <LoginLink>Login</LoginLink> to view it
      </div>
    );
  }

  const posts = await serverClient.getPostsByUser({ id: user.id });

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

export default Page;
