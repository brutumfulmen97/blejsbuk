"use client";

import { FC, Suspense, useRef } from "react";
import { Edit, Loader2, MessageCircleMore, Trash } from "lucide-react";
import { trpc } from "~/app/_trpc/client";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { ForwardRefROEditor } from "./Editor/ForwardRefROEditor";
import clsx from "clsx";
import CommentForm from "./Comment";
import Comment from "./CommentView";
import { Button } from "~/components/ui/moving-border";
interface PostProps {
  mainPage?: boolean;
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

const Post: FC<PostProps> = ({ post, mainPage = false }) => {
  const router = useRouter();
  const editorRef = useRef(null);
  const comments = trpc.getCommentsByPost.useQuery({ id: post.id });

  const mutation = trpc.deletePost.useMutation({
    onMutate: () => {
      router.push(`/post/${post.id}`);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const { user } = useKindeBrowserClient();

  return (
    <div className="relative w-full bg-zinc-900 rounded-2xl p-8 flex flex-col gap-4">
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
            "relative w-full overflow-y-clip transition-all duration-300 ease-in-out"
          )}
        >
          <ForwardRefROEditor
            markdown={post.content}
            className={clsx(
              "px-2 pointer-events-none light-editor",
              mainPage ? "max-h-24" : ""
            )}
            ref={editorRef}
          />
          {mainPage && (
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-900 " />
          )}
        </div>
      </Suspense>
      {mainPage && (
        <Button onClick={() => router.push(`/post/${post.id}`)}>
          <p className="text-zinc-200 mr-2">Comment</p>
          <MessageCircleMore size={20} />
        </Button>
      )}
      {!mainPage && (
        <div className="flex flex-col gap-4">
          {comments.data?.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </div>
      )}
      {user && !mainPage && <CommentForm postId={post.id} />}
    </div>
  );
};

export default Post;
