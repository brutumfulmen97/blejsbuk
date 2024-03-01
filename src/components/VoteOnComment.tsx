import { usePrevious } from "@mantine/hooks";
import { VoteType } from "@prisma/client";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import toast from "react-hot-toast";
import { trpc } from "~/app/_trpc/client";

interface VoteOnCommentProps {
  initialVote: VoteType | null | undefined;
  votesAmount: number;
  commentId: string;
}

const VoteOnComment: FC<VoteOnCommentProps> = ({
  initialVote,
  votesAmount,
  commentId,
}) => {
  const router = useRouter();
  const [numOfLikes, setNumOfLikes] = useState(votesAmount);
  const [currentVote, setCurrentVote] = useState(initialVote);
  const previousVote = usePrevious(initialVote);

  const mutation = trpc.voteOnComment.useMutation({
    onSettled: () => {
      router.refresh();
    },
    onError: (err, vote) => {
      if (vote.type === "UP") {
        setNumOfLikes(numOfLikes - 1);
      } else {
        setNumOfLikes(numOfLikes + 1);
      }
      setCurrentVote(previousVote);

      toast.error(err.message);
    },
    onMutate: (vote) => {
      if (currentVote === vote.type) {
        setCurrentVote(undefined);
        if (vote.type === "UP") {
          setNumOfLikes(numOfLikes - 1);
        } else {
          setNumOfLikes(numOfLikes + 1);
        }
      } else if (currentVote === undefined) {
        setCurrentVote(vote.type);
        if (vote.type === "UP") {
          setNumOfLikes(numOfLikes + 1);
        } else {
          setNumOfLikes(numOfLikes - 1);
        }
      } else {
        if (vote.type === "UP") {
          setNumOfLikes(numOfLikes + 2);
        } else {
          setNumOfLikes(numOfLikes - 2);
        }
        setCurrentVote(vote.type);
      }
    },
  });

  return (
    <div className="flex items-center gap-2">
      <button
        disabled={mutation.isPending}
        className="hover:opacity-75 disabled:opacity-45 disabled:cursor-not-allowed transition-opacity duration-150 ease-in"
        onClick={() => {
          mutation.mutate({ commentId, type: "UP" });
        }}
      >
        <ArrowBigUp
          size={16}
          fill={currentVote === "UP" ? "white" : "transparent"}
        />
      </button>
      <p className="text-sm text-center text-slate-300">{numOfLikes}</p>
      <button
        disabled={mutation.isPending}
        className="hover:opacity-75 disabled:opacity-45 disabled:cursor-not-allowed transition-opacity duration-150 ease-in"
        onClick={() => {
          mutation.mutate({ commentId, type: "DOWN" });
        }}
      >
        <ArrowBigDown
          size={16}
          fill={currentVote === "DOWN" ? "white" : "transparent"}
        />
      </button>
    </div>
  );
};

export default VoteOnComment;
