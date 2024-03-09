import EditProfileDrawer from "~/components/EditProfileDrawer";
import PostList from "~/components/PostList";
import { WavyBackground } from "~/components/ui/wavy-background";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  return (
    <>
      <WavyBackground>
        <h1 className="text-4xl px-2 text-center text-zinc-200 font-bold w-full">
          Welcome to Blejsbuk
        </h1>
        <p className="mt-2 text-zinc-300 text-2xl text-center w-full">
          The social network for developers
        </p>
      </WavyBackground>
      <EditProfileDrawer />
      <PostList />
    </>
  );
}
