import { Heart } from "lucide-react";
import { FC, useState } from "react";
import { Button } from "./ui/moving-border";
import { trpc } from "~/app/_trpc/client";
import toast from "react-hot-toast";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from "next/navigation";

interface LikeProps {
  post: {
    id: string;
    Likes: {
      id: string;
      authorId: string;
      authorName: string;
    }[];
  };
}

const Like: FC<LikeProps> = ({ post }) => {
  const { user } = useKindeBrowserClient();
  const router = useRouter();
  const userInLikes = post?.Likes.find((like) => like.authorId === user?.id);
  const [isLikedBool, setIsLikedBool] = useState(!!userInLikes);

  const mutation = trpc.likePost.useMutation({
    onSettled: () => {
      toast.success(!userInLikes ? "Liked post" : "Unliked post");
      router.refresh();
    },
    onError: (err) => {
      toast.error(err.message);
    },
    onMutate: () => {
      setIsLikedBool((prev) => !prev);
    },
  });

  return (
    <div className="flex gap-4 flex-wrap items-center">
      <Button
        className="hover:opacity-75 transition-opacity duration-150 ease-in"
        onClick={() => {
          mutation.mutate({ postId: post.id });
        }}
      >
        <p className="text-zinc-200 mr-2">{isLikedBool ? "Liked" : "Like"}</p>
        <Heart size={20} color={isLikedBool ? "red" : "white"} />
      </Button>
      {post && post?.Likes?.length > 0 && (
        <>
          <p className="text-slate-400">
            Liked by:{" "}
            {post?.Likes?.map((like, i) =>
              i === post?.Likes.length - 1 && i < 5 ? (
                <span key={like.id}>
                  {`${user?.given_name} ${user?.family_name}` ===
                  like.authorName
                    ? "you"
                    : like.authorName}
                </span>
              ) : (
                <span key={like.id}>
                  {`${user?.given_name} ${user?.family_name}` ===
                  like.authorName
                    ? "you"
                    : like.authorName}
                  ,{" "}
                </span>
              )
            )}
            {post.Likes?.length > 5 && `and ${post.Likes?.length - 5} others`}
          </p>
        </>
      )}
    </div>
  );
};

export default Like;
