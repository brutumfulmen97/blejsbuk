"use client";

import { FC } from "react";
import { Edit, Loader2, Trash } from "lucide-react";
import { trpc } from "~/app/_trpc/client";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
interface PostProps {
  post: {
    id: string;
    title: string;
    content: string;
    authorId: string;
    authorName: string;
    createdAt: Date;
    editedAt: Date;
  };
}

const Post: FC<PostProps> = ({ post }) => {
  const router = useRouter();

  const mutation = trpc.deletePost.useMutation({
    onMutate: () => {
      router.refresh();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const { user } = useKindeBrowserClient();

  return (
    <div className="relative mb-8 w-full bg-zinc-900 rounded-lg p-8 flex flex-col gap-4">
      <p className="text-slate-300 text-sm">
        Posted {formatDistanceToNow(post.createdAt)} ago
      </p>
      {new Date(post.editedAt).getTime() !==
        new Date(post.createdAt).getTime() && (
        <p className="text-xs text-slate-500 -mt-2">
          Edited {formatDistanceToNow(post.editedAt)} ago
        </p>
      )}
      <div className="flex gap-4 justify-end absolute right-8 top-8">
        {user && user.id == post.authorId && (
          <>
            <Edit
              size={20}
              className="hover:opacity-70 cursor-pointer"
              onClick={() => router.push(`/post/${post.id}/edit`)}
            />
            {mutation.isPending ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Trash
                size={20}
                className="hover:opacity-70 cursor-pointer"
                onClick={() =>
                  mutation.mutate({ id: post.id, authorId: post.authorId })
                }
              />
            )}
          </>
        )}
      </div>
      <Link
        href={`/post/${post.id}`}
        className="text-2xl text-slate-300 hover:underline"
      >
        {post.title}
      </Link>
      <p>{post.content}</p>
      <p className="text-end w-full">by: {post.authorName}</p>
    </div>
  );
};

export default Post;
