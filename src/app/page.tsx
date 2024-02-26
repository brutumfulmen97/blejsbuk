import { Suspense } from "react";
import Form from "~/components/Form";
import PostList from "~/components/PostList";
import { PostsSkeleton } from "~/components/PostSkeleton";
import { WavyBackground } from "~/components/ui/wavy-background";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  return (
    <>
      {/* <GoogleGeminiEffectDemo /> */}
      <WavyBackground>
        <h1 className="text-4xl text-center text-zinc-200 font-bold w-full">
          Welcome to Blejsbuk
        </h1>
        <p className="mt-2 text-zinc-300 text-2xl text-center w-full">
          The social network for developers
        </p>
      </WavyBackground>
      {/* <Form orientation={"landscape"} /> */}
      <Suspense
        fallback={
          <div className="px-8 md:px-0">
            <PostsSkeleton />
          </div>
        }
      >
        <PostList />
      </Suspense>
    </>
  );
}
