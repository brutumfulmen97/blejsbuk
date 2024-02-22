import { Suspense } from "react";
import Form from "~/components/Form";
import PostList from "~/components/PostList";
import { PostsSkeleton } from "~/components/PostSkeleton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  return (
    <>
      <h1 className="text-2xl text-slate-200 font-bold mb-12">
        Here are the posts...
      </h1>
      {/* <Form orientation={"landscape"} /> */}
      <Suspense fallback={<PostsSkeleton />}>
        <PostList />
      </Suspense>
    </>
  );
}
