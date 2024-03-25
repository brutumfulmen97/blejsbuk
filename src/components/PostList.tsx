"use client";

import { trpc } from "~/app/_trpc/client";
import { VoteType } from "@prisma/client";
import { FC, Suspense, useEffect, useRef } from "react";
import { Edit, MessageCircleMore } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ForwardRefROEditor } from "./Editor/ForwardRefROEditor";
import DeletePost from "./DeletePost";
import { formatDistanceToNow } from "date-fns";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/dist/types";
import { PostSkeleton } from "./PostSkeleton";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Like from "./Like";

export default function PostList() {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { user } = useKindeBrowserClient();

  const myQuery = trpc.infinitePosts.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
    }
  );
  useEffect(() => {
    if (myQuery.hasNextPage) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          myQuery.fetchNextPage();
        }
      });

      let bottomRefCurrent: any;
      if (bottomRef.current) {
        bottomRefCurrent = bottomRef.current;

        observer.observe(bottomRefCurrent);
      }
      return () => {
        if (bottomRefCurrent) {
          observer.unobserve(bottomRefCurrent);
        }
      };
    }
  }, [myQuery]);

  if (myQuery.isPending) {
    return (
      <div className="px-8 md:px-0">
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
      </div>
    );
  }

  if (myQuery.error) {
    return <div>Error: {myQuery.error.message}</div>;
  }

  if (!myQuery.data) {
    return <div>No data</div>;
  }

  return (
    <div className="flex flex-col px-8 md:px-0 pb-16">
      {myQuery.data.pages.map((page, i) => {
        return (
          <div key={i}>
            {page.posts.map((post) => {
              return <Post key={post.id} post={post} user={user} />;
            })}
          </div>
        );
      })}
      {myQuery.hasNextPage && <div ref={bottomRef}></div>}
      {myQuery.isFetchingNextPage && (
        <div className="-mt-4">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!myQuery.hasNextPage && (
        <div className="text-center text-slate-300">
          <p>End of posts</p>
        </div>
      )}
    </div>
  );
}

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
}

const Post: FC<PostProps> = ({ post, user }) => {
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
    <div className="relative w-full bg-zinc-900 rounded-2xl p-8 flex flex-col gap-4 mb-12">
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
        initialVote={_currentVote}
      />
    </div>
  );
};
