import { Suspense } from "react";
import Form from "~/components/Form";
import PostList from "~/components/PostList";
import { PostsSkeleton } from "~/components/PostSkeleton";
import { GoogleGeminiEffectDemo } from "~/components/ui/GoogleGemini";
import { GoogleGeminiEffect } from "~/components/ui/google-gemini-effect";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  return (
    <>
      <GoogleGeminiEffectDemo />
      {/* <Form orientation={"landscape"} /> */}
      <Suspense fallback={<PostsSkeleton />}>
        <PostList />
      </Suspense>
    </>
  );
}
