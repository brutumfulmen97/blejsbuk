"use client";

import { Comment, Vote, VoteType } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { FC, useState } from "react";
import ReplyForm from "./ReplyForm";
import ReplyView from "./ReplyView";
import { Reply } from "lucide-react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import VoteOnComment from "./VoteOnComment";

interface CommentViewProps {
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
  postId: string;
}

const CommentView: FC<CommentViewProps> = ({ comment, postId }) => {
  const [isHidden, setIsHidden] = useState(true);

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

  return comment.parentId === null ? (
    <div className="rounded-md border border-slate-400 p-4 relative">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <VoteOnComment
          initialVote={_currentVote}
          votesAmount={_votesAmount}
          commentId={comment.id}
        />
        <button
          onClick={() => setIsHidden(!isHidden)}
          className="p-1 border border-slate-200 hover:bg-slate-600 rounded-md"
        >
          <Reply size={16} />
        </button>
      </div>
      <div className="mb-4">
        <p className="text-slate-200 text-xs">
          Posted {formatDistanceToNow(comment.createdAt)} ago by:
          <span className="text-slate-400"> {comment.authorName}</span>
        </p>
        <p className="mt-2">{comment.content}</p>
      </div>
      <ReplyForm isHidden={isHidden} parentId={comment.id} postId={postId} />
      <div className="ml-2 flex flex-col gap-2">
        {comment.Comments?.map((reply) => (
          <ReplyView key={reply.id} comment={reply as any} />
        ))}
      </div>
    </div>
  ) : null;
};

export default CommentView;
