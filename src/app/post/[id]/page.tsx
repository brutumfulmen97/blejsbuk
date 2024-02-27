import { FC } from "react";
import { serverClient } from "~/app/_trpc/serverClient";
import Post from "~/components/Post";

interface pageProps {
  params: {
    id?: string;
  };
}

const page: FC<pageProps> = async ({ params }) => {
  if (!params.id) {
    return <div>Post not found</div>;
  }

  const post = await serverClient.getPostById({ id: params.id });

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="p-8 md:p-0">
      <Post post={post} singlePostPage={true} />
    </div>
  );
};

export default page;
