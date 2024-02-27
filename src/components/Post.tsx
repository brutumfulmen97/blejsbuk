import { FC, Suspense } from "react";
import { Edit, MessageCircleMore, Trash } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { ForwardRefROEditor } from "./Editor/ForwardRefROEditor";
import clsx from "clsx";
import CommentForm from "./Comment";
import Comment from "./CommentView";
import { Button } from "~/components/ui/moving-border";
import LikeServerComponent from "./LikeServer";
import { VoteType } from "@prisma/client";
import { serverClient } from "~/app/_trpc/serverClient";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import DeletePost from "./DeletePost";
import Image from "next/image";
interface PostProps {
  singlePostPage?: boolean;
  post: {
    id: string;
    title: string;
    content: string;
    authorId: string;
    authorName: string;
    imageUrl: string | null;
    createdAt: Date;
    editedAt: Date;
    Subreddit: {
      name: string;
      id: string;
    };
    Votes: {
      id: string;
      postId: string;
      authorId: string;
      authorName: string;
      type: VoteType;
    }[];
  };
}

const Post: FC<PostProps> = async ({ post, singlePostPage = false }) => {
  const comments = await serverClient.getCommentsByPost({ id: post.id });
  const { getUser } = await getKindeServerSession();

  const user = await getUser();

  return (
    <div className="relative w-full bg-zinc-900 rounded-2xl p-8 flex flex-col gap-4">
      <p className="text-sm text-slate-300">by: {post.authorName}</p>
      <p className="text-slate-300 text-sm max-w-[80%]">
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
            <Link href={`/post/${post.id}/edit`}>
              <Edit size={20} className="hover:opacity-70 cursor-pointer" />
            </Link>
            <DeletePost postId={post.id} authorId={post.authorId} />
          </>
        )}
      </div>
      <Link
        href={`/post/${post.id}`}
        className="text-2xl text-slate-300 hover:underline max-w-[80%]"
      >
        {post.title}
      </Link>
      {post.imageUrl && (
        <Image src={post.imageUrl} width={500} height={500} alt="post image" />
      )}
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
              !singlePostPage ? "max-h-24" : ""
            )}
          />
          {!singlePostPage && (
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-900 " />
          )}
        </div>
      </Suspense>
      {!singlePostPage && (
        <div className="flex gap-4 flex-wrap">
          <Link href={`/post/${post.id}`}>
            <Button className="hover:opacity-75 transition-opacity duration-150 ease-in">
              <p className="text-zinc-200 mr-2">Comment</p>
              <MessageCircleMore size={20} />
            </Button>
          </Link>
        </div>
      )}
      {singlePostPage && !user && (
        <p className="text-slate-300">
          You must be logged in to post comments!
        </p>
      )}
      {singlePostPage && (
        <div className="flex flex-col gap-4">
          {comments?.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </div>
      )}
      {user && singlePostPage && <CommentForm postId={post.id} />}
      <LikeServerComponent post={post} />
    </div>
  );
};

export default Post;
