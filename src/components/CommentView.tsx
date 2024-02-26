import { formatDistanceToNow } from "date-fns";
import { FC } from "react";

interface CommentViewProps {
  comment: {
    id: string;
    content: string;
    authorId: string;
    authorName: string;
    createdAt: Date;
    editedAt: Date;
  };
}

const CommentView: FC<CommentViewProps> = ({ comment }) => {
  return (
    <div className="rounded-md border border-slate-400 p-4">
      <p className="text-slate-200 text-xs">
        Posted {formatDistanceToNow(comment.createdAt)} ago by:
        <span className="text-slate-400"> {comment.authorName}</span>
      </p>
      <p className="mt-2">{comment.content}</p>
    </div>
  );
};

export default CommentView;
