"use client";

import { FC } from "react";
import { Trash } from "lucide-react";
import { trpc } from "~/app/_trpc/client";

interface PostProps {
  post: {
    id: number;
    title: string;
    content: string;
    authorId: string;
  };
}

const Post: FC<PostProps> = ({ post }) => {
  const mutation = trpc.deletePost.useMutation({
    onSettled: () => {
      // trpc.invalidateQuery(["getPosts"]);
      console.log("success");
    },
  });

  return (
    <div className="mb-8 w-full bg-zinc-900 rounded-lg p-8 flex flex-col gap-4">
      <div className="flex justify-end">
        <Trash
          size={20}
          className="hover:opacity-70 cursor-pointer"
          onClick={() =>
            mutation.mutate({ id: post.id, authorId: post.authorId })
          }
        />
      </div>
      <h2 className="text-2xl text-slate-300">{post.title}</h2>
      <p>{post.content}</p>
      <p className="text-end w-full">by: {post.authorId.substring(0, 12)}</p>
    </div>
  );
};

export default Post;
