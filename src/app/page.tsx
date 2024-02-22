import { Suspense } from "react";
import PostList from "~/components/PostList";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  return (
    <>
      <h1 className="text-2xl text-slate-200 font-bold mb-12">
        Here are the posts...
      </h1>
      <Suspense fallback={<div>Loading...</div>}>
        <PostList />
      </Suspense>
    </>
  );
}
