import { FC } from "react";
import { serverClient } from "~/app/_trpc/serverClient";

interface Props {
  params: {
    id: string;
  };
}

const page: FC<Props> = async ({ params }) => {
  const subreddit = await serverClient.getCommunity({ id: params.id });

  if (!subreddit) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{subreddit.name}</h1>
      <p>{subreddit.description}</p>
    </div>
  );
};

export default page;
