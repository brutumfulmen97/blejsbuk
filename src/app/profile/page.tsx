import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { serverClient } from "../_trpc/serverClient";
import Post from "~/components/Post";
import ProfileCard from "~/components/ProfileCard";

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
      <h2 className="text-lg mb-4">Here are your posts...</h2>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default page;
