"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Comment, VoteType, Vote } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { FC, useState } from "react";
import VoteOnComment from "./VoteOnComment";
import { Edit2, XCircle } from "lucide-react";
import EditComment from "./EditComment";

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
  const [isInEditMode, setIsInEditMode] = useState(false);

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
        <div className="flex items-center gap-2">
          <p className="text-slate-200 text-xs">
            Posted {formatDistanceToNow(comment.createdAt)} ago by:
            <span className="text-slate-400"> {comment.authorName}</span>
          </p>
          {user && user.id === comment.authorId && (
            <button
              className="border border-slate-200 hover:bg-slate-700 rounded-md p-1"
              onClick={() => setIsInEditMode(!isInEditMode)}
            >
              {isInEditMode ? <XCircle size={16} /> : <Edit2 size={16} />}
            </button>
          )}
        </div>

        <VoteOnComment
          initialVote={_currentVote}
          votesAmount={_votesAmount ?? 0}
          commentId={comment.id}
        />
      </div>
      {isInEditMode ? (
        <div className="mt-2">
          <EditComment
            content={comment.content}
            commentId={comment.id}
            setIsInEditMode={setIsInEditMode}
          />
        </div>
      ) : (
        <p className="mt-2">{comment.content}</p>
      )}
    </div>
  ) : null;
};

export default ReplyView;
