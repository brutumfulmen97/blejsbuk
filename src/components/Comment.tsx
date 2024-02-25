"use client";

import CommentForm from "./CommentForm";
import clsx from "clsx";

function Comment({ postId }: { postId: string }) {
  return (
    <>
      <div className={clsx("w-full mt-2")}>
        <CommentForm postId={postId} />
      </div>
    </>
  );
}

export default Comment;
