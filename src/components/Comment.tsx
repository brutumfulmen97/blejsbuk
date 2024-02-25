"use client";

import { MessageCircleMore } from "lucide-react";
import CommentForm from "./CommentForm";
import { useState } from "react";
import clsx from "clsx";
import { Button } from "./ui/moving-border";

function Comment({ postId }: { postId: string }) {
  const [isHidden, setIsHidden] = useState(true);

  return (
    <>
      <Button onClick={() => setIsHidden(!isHidden)}>
        <p className="text-zinc-200 mr-2">Comment</p>
        <MessageCircleMore size={20} />
      </Button>
      <div className={clsx("w-full mt-2", isHidden ? "hidden" : "block")}>
        <CommentForm postId={postId} />
      </div>
    </>
  );
}

export default Comment;
