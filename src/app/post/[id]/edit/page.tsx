import { FC } from "react";
import { serverClient } from "~/app/_trpc/serverClient";
import PostEditForm from "~/components/PostEditForm";

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
    return <div>Post not found!</div>;
  }

  return <PostEditForm post={post} />;
};

export default page;
