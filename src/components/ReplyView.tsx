"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Comment, VoteType, Vote } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { FC } from "react";
import VoteOnComment from "./VoteOnComment";

interface ReplyViewProps {
  comment: {
    authorId: string;
    authorName: string;
    content: string;
    createdAt: Date;
    id: string;
    parentId: string | null;
    Comments: Comment[];
    Votes: Vote[];
  };
}

const ReplyView: FC<ReplyViewProps> = ({ comment }) => {
  const { user } = useKindeBrowserClient();

  let _votesAmount = 0;
  let _currentVote: VoteType | null | undefined = undefined;

  _votesAmount = comment.Votes?.reduce((acc, like) => {
    if (like.type === "UP") {
      return acc + 1;
    }
    if (like.type === "DOWN") {
      return acc - 1;
    }
    return acc;
  }, 0);

  _currentVote = comment.Votes?.find(
    (vote) => vote.authorId === user?.id
  )?.type;

  return comment.parentId ? (
    <div className="rounded-md border border-slate-400 p-4">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-slate-200 text-xs">
          Posted {formatDistanceToNow(comment.createdAt)} ago by:
          <span className="text-slate-400"> {comment.authorName}</span>
        </p>
        <VoteOnComment
          initialVote={_currentVote}
          votesAmount={_votesAmount ?? 0}
          commentId={comment.id}
        />
      </div>
      <p className="mt-2">{comment.content}</p>
    </div>
  ) : null;
};

export default ReplyView;
