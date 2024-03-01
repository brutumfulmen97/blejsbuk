"use client";

import { Comment } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { FC } from "react";

interface ReplyViewProps {
  comment: Comment & {
    Comments?: Comment[];
  };
}

const ReplyView: FC<ReplyViewProps> = ({ comment }) => {
  return comment.parentId ? (
    <div className="rounded-md border border-slate-400 p-4">
      <div className="mb-4">
        <p className="text-slate-200 text-xs">
          Posted {formatDistanceToNow(comment.createdAt)} ago by:
          <span className="text-slate-400"> {comment.authorName}</span>
        </p>
        <p className="mt-2">{comment.content}</p>
      </div>
    </div>
  ) : null;
};

export default ReplyView;
