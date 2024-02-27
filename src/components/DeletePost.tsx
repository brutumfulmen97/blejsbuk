"use client";

import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC } from "react";
import toast from "react-hot-toast";
import { trpc } from "~/app/_trpc/client";

interface DeletePostProps {
  postId: string;
  authorId: string;
}

const DeletePost: FC<DeletePostProps> = ({ postId, authorId }) => {
  const router = useRouter();

  const mutation = trpc.deletePost.useMutation({
    onSettled: () => {
      router.refresh();
    },
    onSuccess: () => {
      toast.success("Deleted post");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <Trash
      size={20}
      onClick={() => mutation.mutate({ id: postId, authorId: authorId })}
      className="hover:opacity-70 cursor-pointer"
    />
  );
};

export default DeletePost;
