import { Heart } from "lucide-react";
import { FC } from "react";
import { Button } from "./ui/moving-border";
import { trpc } from "~/app/_trpc/client";
import toast from "react-hot-toast";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

interface LikeProps {
  postId: string;
}

const Like: FC<LikeProps> = ({ postId }) => {
  const { data } = trpc.getLikesForPost.useQuery({ id: postId });
  const { user } = useKindeBrowserClient();
  const isLiked = data?.find((like) => like.authorId === user?.id);

  const mutation = trpc.likePost.useMutation({
    onSettled: () => {
      toast.success(!isLiked ? "Liked post" : "Unliked post");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <div className="flex gap-4 flex-wrap items-center">
      <Button
        className="hover:opacity-75 transition-opacity duration-150 ease-in"
        onClick={() => {
          mutation.mutate({ postId });
        }}
      >
        <p className="text-zinc-200 mr-2">
          {mutation.isPending ? "Processing..." : isLiked ? "Liked" : "Like"}
        </p>
        <Heart size={20} color={isLiked ? "red" : "white"} />
      </Button>
      {data && data?.length > 0 && (
        <>
          <p className="text-slate-400">
            Liked by:{" "}
            {data?.map((like, i) =>
              i === data?.length - 1 && i < 5 ? (
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
            {data?.length > 5 && `and ${data?.length - 5} others`}
          </p>
        </>
      )}
    </div>
  );
};

export default Like;
