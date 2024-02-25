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
      <p className="mb-2">{comment.content}</p>
      <p className="text-slate-100 text-sm">
        Posted {formatDistanceToNow(comment.createdAt)} ago
        <span className="text-slate-300">by: {comment.authorName}</span>
      </p>
    </div>
  );
};

export default CommentView;
