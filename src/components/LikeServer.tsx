import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Like from "./Like";
import { VoteType } from "@prisma/client";

interface LikeServerProps {
  post: {
    id: string;
    Votes: {
      id: string;
      authorId: string;
      authorName: string;
      type: VoteType;
    }[];
  };
}

const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

async function LikeServer({ post }: LikeServerProps) {
  const { getUser } = await getKindeServerSession();
  const user = await getUser();

  let _votesAmount = 0;
  let _currentVote: VoteType | null | undefined = undefined;

  _votesAmount = post.Votes.reduce((acc, like) => {
    if (like.type === "UP") {
      return acc + 1;
    }
    if (like.type === "DOWN") {
      return acc - 1;
    }
    return acc;
  }, 0);

  _currentVote = post.Votes.find((vote) => vote.authorId === user?.id)?.type;

  return (
    <Like
      postId={post.id}
      inititalVote={_currentVote}
      initialVotesAmount={_votesAmount}
    />
  );
}

export default LikeServer;
