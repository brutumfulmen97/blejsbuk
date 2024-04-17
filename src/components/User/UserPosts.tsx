"use client";

import { FC, Suspense, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { Link } from "next-view-transitions";
import { formatDistanceToNow } from "date-fns";
import { Edit, MessageCircleMore } from "lucide-react";
import DeletePost from "../DeletePost";
import { ForwardRefROEditor } from "../Editor/ForwardRefROEditor";
import Like from "../Like";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/dist/types";
import { VoteType } from "@prisma/client";
import PostClient from "../PostClient";
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
          <div className="overflow-x-hidden">
            <div className="w-[200%] flex transition-all">
              <div
                className={clsx(
                  "px-8 md:px-0 flex flex-col transition-all duration-300 ease-in-out flex-1 origin-left",
                  activeTab === "savedPosts" ? "scale-x-[100%]" : "scale-x-0"
                )}
              >
                {savedPosts.map((savedPost) => (
                  <PostClient key={savedPost.id} post={savedPost} />
                ))}
              </div>
              <div
                className={clsx(
                  "px-8 md:px-0 flex flex-col gap-4 transition-all duration-300 ease-in-out flex-1 origin-right",
                  activeTab === "posts"
                    ? "-scale-x-[100%] -translate-x-[200%]"
                    : "scale-x-0"
                )}
              >
                {posts.map((post) => (
                  <PostClient
                    key={post.id}
                    post={post}
                    mirror={activeTab === "posts"}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
      {!isYourProfile && (
        <div className="px-8 md:px-0 flex flex-col">
          {posts.map((post) => (
            <PostClient key={post.id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};

export default UserPosts;
