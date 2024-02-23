"use client";

import { FC, Suspense, useRef, useState } from "react";
import { ChevronDown, Edit, Loader2, Trash } from "lucide-react";
import { trpc } from "~/app/_trpc/client";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { ForwardRefROEditor } from "./Editor/ForwardRefROEditor";
import clsx from "clsx";
import Comment from "./Comment";
interface PostProps {
  post: {
    id: string;
    title: string;
    content: string;
    authorId: string;
    authorName: string;
    createdAt: Date;
    editedAt: Date;
    Subreddit: {
      name: string;
      id: string;
    };
  };
}

const Post: FC<PostProps> = ({ post }) => {
  const router = useRouter();
  const editorRef = useRef(null);
  const [showMore, setShowMore] = useState(false);

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
      <p className="text-sm text-slate-300">by: {post.authorName}</p>
      <p className="text-slate-300 text-sm">
        Posted {formatDistanceToNow(post.createdAt)} ago{" "}
        <Link
          href={`/community/${post.Subreddit.id}`}
          className="text-slate-400 hover:underline"
        >
          in r/
          {post.Subreddit.name}
        </Link>
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
      <Suspense fallback={<p>Loading...</p>}>
        <div
          className={clsx(
            "relative w-full overflow-y-hidden",
            showMore ? "max-h-auto" : "max-h-[100px]"
          )}
        >
          <ForwardRefROEditor
            markdown={post.content}
            className="px-2 pointer-events-none light-editor"
            ref={editorRef}
          />
          <div
            className="absolute bottom-0 w-full h-full"
            style={{
              background: !showMore
                ? "linear-gradient(to top, #18181b, transparent)"
                : "transparent",
            }}
          ></div>
          <ChevronDown
            size={24}
            className={clsx(
              "absolute bottom-0 left-1/2 -translate-x-1/2 transition-all duration-300 ease-in-out hover:opacity-70 cursor-pointer",
              showMore ? "rotate-180" : ""
            )}
            onClick={() => {
              setShowMore(!showMore);
            }}
          />
        </div>
      </Suspense>
      {user && <Comment postId={post.id} />}
    </div>
  );
};

export default Post;
