import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { serverClient } from "../_trpc/serverClient";
import Post from "~/components/Post";
import ProfileCard from "~/components/ProfileCard";
import { BackgroundGradientAnimation } from "~/components/ui/background-gradient";
import { TextGenerateEffect } from "~/components/ui/text-generate";

const page = async ({}) => {
  const { getUser } = await getKindeServerSession();

  const user = await getUser();

  if (!user) {
    redirect("/");
  }

  const posts = await serverClient.getPostsByUser({ id: user.id });

  if (!posts) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-20 md:mt-0">
      <div className="px-8 md:px-0">
        <ProfileCard user={user} />
      </div>
      <BackgroundGradientAnimation>
        <h2 className="w-full text-center text-2xl z-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <TextGenerateEffect words="Here are your posts..." />
        </h2>
      </BackgroundGradientAnimation>
      <div className="px-8 md:px-0 flex flex-col gap-8">
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default page;
