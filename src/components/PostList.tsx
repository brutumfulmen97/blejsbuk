"use client";

import { trpc } from "~/app/_trpc/client";
import { useEffect, useRef } from "react";
import { PostSkeleton } from "./PostSkeleton";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import PostClient from "./PostClient";

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
              return <PostClient key={post.id} post={post} user={user} />;
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
