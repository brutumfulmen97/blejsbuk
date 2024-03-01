"use client";

import { Comment, Vote, VoteType } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { FC, useRef, useState } from "react";
import ReplyForm from "./ReplyForm";
import ReplyView from "./ReplyView";
import { Edit2, Reply, XCircle } from "lucide-react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import VoteOnComment from "./VoteOnComment";
import EditComment from "./EditComment";
import { useOnClickOutside } from "~/hooks/useOnClickOutside";

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
  const [isInEditMode, setIsInEditMode] = useState(false);
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

  const ref = useRef(null);

  const handleClickOutside = () => {
    setIsHidden(true);
  };

  useOnClickOutside(ref, handleClickOutside);

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
      <div ref={ref}>
        <ReplyForm isHidden={isHidden} parentId={comment.id} postId={postId} />
      </div>
      <div className="ml-2 flex flex-col gap-2">
        {comment.Comments?.map((reply) => (
          <ReplyView key={reply.id} comment={reply as any} />
        ))}
      </div>
    </div>
  ) : null;
};

export default CommentView;
