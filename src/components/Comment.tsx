"use client";

import { MessageCircleMore } from "lucide-react";
import CommentForm from "./CommentForm";
import { useState } from "react";
import clsx from "clsx";

function Comment({ postId }: { postId: string }) {
  const [isHidden, setIsHidden] = useState(true);

  return (
    <>
      <div
        className="w-[fit-content] px-4 py-2 rounded-md bg-slate-800 hover:bg-slate-900 cursor-pointer mt-4 flex items-center justify-center gap-2"
        onClick={() => setIsHidden(!isHidden)}
      >
        <p className="text-zinc-200">Comment</p>
        <MessageCircleMore size={20} />
      </div>
      <div className={clsx("w-full mt-2", isHidden ? "hidden" : "block")}>
        <CommentForm postId={postId} />
      </div>
    </>
  );
}

export default Comment;
