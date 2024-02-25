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

  return (
    <div className="w-full h-screen flex justify-center items-center px-8 md:px-0">
      <PostEditForm post={post} />
    </div>
  );
};

export default page;
