"use client";

import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { FC, useState } from "react";
import { trpc } from "~/app/_trpc/client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { usePrevious } from "@mantine/hooks";

interface LikeProps {
  postId: string;
  initialVotesAmount: number;
  inititalVote: "UP" | "DOWN" | null | undefined;
}

const Like: FC<LikeProps> = ({ postId, initialVotesAmount, inititalVote }) => {
  const router = useRouter();
  const [numOfLikes, setNumOfLikes] = useState(initialVotesAmount);
  const [currentVote, setCurrentVote] = useState(inititalVote);
  const previousVote = usePrevious(inititalVote);

  const mutation = trpc.likePost.useMutation({
    onSettled: () => {
      router.refresh();
    },
    onSuccess: () => {
      toast.success(true ? "Liked post" : "Unliked post");
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
      } else {
        setCurrentVote(vote.type);
        if (vote.type === "UP") {
          setNumOfLikes(numOfLikes + 1);
        } else {
          setNumOfLikes(numOfLikes - 1);
        }
      }
    },
  });

  return (
    <div className="absolute bottom-8 right-8 flex flex-col justify-center items-center gap-2">
      <button
        className="hover:opacity-75 transition-opacity duration-150 ease-in"
        onClick={() => {
          mutation.mutate({ postId, type: "UP" });
        }}
      >
        <ArrowBigUp
          size={24}
          fill={currentVote === "UP" ? "white" : "transparent"}
        />
      </button>
      <p className="text-sm text-center text-slate-300">{numOfLikes}</p>
      <button
        className="hover:opacity-75 transition-opacity duration-150 ease-in"
        onClick={() => {
          mutation.mutate({ postId, type: "DOWN" });
        }}
      >
        <ArrowBigDown
          size={24}
          fill={currentVote === "DOWN" ? "white" : "transparent"}
        />
      </button>
    </div>
  );
};

export default Like;
