"use client";

import { FC, Suspense, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Edit, MessageCircleMore } from "lucide-react";
import DeletePost from "../DeletePost";
import { ForwardRefROEditor } from "../Editor/ForwardRefROEditor";
import Like from "../Like";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/dist/types";
import { VoteType } from "@prisma/client";

interface UserPostsProps {
  posts: any[];
  savedPosts: any[];
  isYourProfile: boolean;
  user: KindeUser | null;
}

const UserPosts: FC<UserPostsProps> = ({
  posts,
  savedPosts,
  isYourProfile,
}) => {
  const [activeTab, setActiveTab] = useState<"posts" | "savedPosts">("posts");

  return (
    <>
      {isYourProfile && (
        <>
          <div className="px-8 md:px-0 flex items-center justify-center gap-2 mb-8">
            <button
              className={clsx(
                "w-full rounded-md py-2 px-4 hover:bg-neutral-500",
                activeTab === "savedPosts"
                  ? "bg-slate-700 ring-2 ring-slate-500"
                  : "bg-neutral-700"
              )}
              onClick={() => setActiveTab("savedPosts")}
            >
              Saved Posts
            </button>
            <button
              className={clsx(
                "w-full rounded-md py-2 px-4 hover:bg-neutral-500",
                activeTab === "posts"
                  ? "bg-slate-700  ring-2 ring-slate-500"
                  : "bg-neutral-700"
              )}
              onClick={() => setActiveTab("posts")}
            >
              Your Posts
            </button>
          </div>
          <div className="w-[200%] overflow-x-hidden flex transition-all">
            <div
              className={clsx(
                "px-8 md:px-0 flex flex-col gap-8 transition-all duration-300 ease-in-out flex-1 origin-left",
                activeTab === "savedPosts" ? "scale-x-[100%]" : "scale-x-0"
              )}
            >
              {savedPosts.map((savedPost) => (
                <Post key={savedPost.id} post={savedPost} />
              ))}
            </div>
            <div
              className={clsx(
                "px-8 md:px-0 flex flex-col gap-8 transition-all duration-300 ease-in-out flex-1 origin-right",
                activeTab === "posts"
                  ? "-scale-x-[100%] -translate-x-[200%]"
                  : "scale-x-0"
              )}
            >
              {posts.map((post) => (
                <Post
                  key={post.id}
                  post={post}
                  mirror={activeTab === "posts"}
                />
              ))}
            </div>
          </div>
        </>
      )}
      {!isYourProfile && (
        <div className="px-8 md:px-0 flex flex-col">
          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};

export default UserPosts;

interface PostProps {
  post: {
    id: string;
    title: string;
    content: string;
    authorId: string;
    authorName: string;
    imageUrl: string | null;
    createdAt: Date;
    editedAt: Date;
    Comments: {}[];
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
  user?: KindeUser | null;
  mirror?: boolean;
}

const Post: FC<PostProps> = ({ post, user, mirror = false }) => {
  let _votesAmount = 0;
  let _currentVote: VoteType | null | undefined = undefined;

  _votesAmount = post.Votes.reduce((acc, like) => {
    if (like.type === "UP") {
      return acc + 1;
    }
    if (like.type === "DOWN") {
      return acc - 1;
    }
    return acc;
  }, 0);

  _currentVote = post.Votes.find((vote) => vote.authorId === user?.id)?.type;

  return (
    <div
      className={clsx(
        "relative w-full bg-zinc-900 rounded-2xl p-8 flex flex-col gap-4 mb-12",
        mirror ? "-scale-x-[100%]" : ""
      )}
    >
      <Link
        href={`/profile/${post.authorId}`}
        className="text-sm text-slate-300 hover:underline"
      >
        by: {post.authorName}
      </Link>
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
        <Link href={`/post/${post.id}`}>
          <Image
            src={post.imageUrl}
            width={500}
            height={500}
            alt="post image"
            className="max-h-96 w-auto rounded-md cursor-pointer hover:opacity-75 transition-opacity duration-150 ease-in-out object-contain mx-auto"
          />
        </Link>
      )}
      <Suspense fallback={<p>Loading...</p>}>
        <div className="relative w-full overflow-y-clip transition-all duration-300 ease-in-out">
          <ForwardRefROEditor
            markdown={post.content}
            className="px-2 pointer-events-none light-editor max-h-24"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-900 " />
        </div>
      </Suspense>
      <div className="flex gap-4 flex-wrap">
        <Link
          href={`/post/${post.id}`}
          className="flex items-center gap-2 bg-neutral-700 p-2 rounded-md  hover:opacity-75 transition-opacity duration-150 ease-in"
        >
          <MessageCircleMore size={20} />
          <p>{post.Comments.length}</p>
        </Link>
      </div>
      <Like
        postId={post.id}
        initialVotesAmount={_votesAmount}
        inititalVote={_currentVote}
      />
    </div>
  );
};
