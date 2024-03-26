"use client";

import clsx from "clsx";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import toast from "react-hot-toast";
import { trpc } from "~/app/_trpc/client";
import { useEditProfileDrawerContext } from "~/utils/EditProfileDrawerContext";

interface SavePostProps {
  postId: string;
  postIsSaved: boolean;
}

const SavePost: FC<SavePostProps> = ({ postId, postIsSaved }) => {
  const [isSaved, setIsSaved] = useState(postIsSaved);
  const { setMessage, setIsOpen } = useEditProfileDrawerContext();
  const router = useRouter();

  const mutation = trpc.savePost.useMutation({
    onSuccess: () => {
      toast.success(!postIsSaved ? "Post saved" : "Post unsaved");
      router.refresh();
    },
    onError: (error) => {
      if (error.message === "User not found.") {
        setMessage("save post");
        setIsOpen(true);
        return;
      }
      toast.error(error.message);
      setIsSaved(postIsSaved);
    },
  });

  return (
    <button
      className={clsx(
        "w-fit p-2 rounded-md  hover:opacity-75 transition-opacity duration-150 ease-in",
        isSaved ? "bg-neutral-400" : "bg-neutral-700"
      )}
      onClick={() => {
        setIsSaved(!isSaved);
        mutation.mutate({
          postId,
        });
      }}
      disabled={mutation.isPending}
    >
      <Save size={20} />
    </button>
  );
};

export default SavePost;
