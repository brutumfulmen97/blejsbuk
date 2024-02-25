import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { serverClient } from "../_trpc/serverClient";
import Post from "~/components/Post";
import ProfileCard from "~/components/ProfileCard";
import { BackgroundGradientAnimation } from "~/components/ui/background-gradient";

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
    <div>
      <ProfileCard user={user} />
      <BackgroundGradientAnimation>
        <h2 className="text-3xl z-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          Here are your posts...
        </h2>
      </BackgroundGradientAnimation>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default page;
