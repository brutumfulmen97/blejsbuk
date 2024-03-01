"use client";

import { Comment } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { FC, useState } from "react";
import ReplyForm from "./ReplyForm";
import ReplyView from "./ReplyView";
import { Reply } from "lucide-react";

interface CommentViewProps {
  comment: Comment & {
    Comments?: Comment[];
  };
  postId: string;
}

const CommentView: FC<CommentViewProps> = ({ comment, postId }) => {
  const [isHidden, setIsHidden] = useState(true);

  return comment.parentId === null ? (
    <div className="rounded-md border border-slate-400 p-4 relative">
      <button
        onClick={() => setIsHidden(!isHidden)}
        className="absolute top-4 right-4 p-1 border border-slate-200 hover:bg-slate-600 rounded-md"
      >
        <Reply size={16} />
      </button>
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
          <ReplyView key={reply.id} comment={reply} />
        ))}
      </div>
    </div>
  ) : null;
};

export default CommentView;
