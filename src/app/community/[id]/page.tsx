import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { FC } from "react";
import { serverClient } from "~/app/_trpc/serverClient";
import JoinButton from "~/components/JoinButton";
import Post from "~/components/Post";
import PostToCommunity from "~/components/PostToCommunity";
import { WavyBackground } from "~/components/ui/wavy-background";

interface Props {
  params: {
    id: string;
  };
}

const page: FC<Props> = async ({ params }) => {
  const subreddit = await serverClient.getCommunity({ id: params.id });
  const { getUser } = await getKindeServerSession();

  const user = await getUser();

  if (!subreddit) {
    return <div>Loading...</div>;
  }

  const posts = await serverClient.getPostsByCommunity({ id: params.id });

  if (!posts) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full overflow-clip">
      <div className="flex flex-wrap gap-2 justify-between">
        <WavyBackground>
          <h1 className="text-4xl text-center text-zinc-200 font-bold w-full">
            Welocome to r/{subreddit.name}
          </h1>
          <p className="mt-2 text-zinc-300 text-2xl text-center w-full">
            {subreddit.description}
          </p>
        </WavyBackground>
        {user && (
          <JoinButton
            userId={user.id}
            communityId={subreddit.id}
            members={subreddit.members}
          />
        )}
      </div>
      {user &&
        subreddit.members.length > 0 &&
        subreddit.members.includes(user.id) && (
          <PostToCommunity communityId={subreddit.id} />
        )}
      <div className="mt-8">
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default page;
