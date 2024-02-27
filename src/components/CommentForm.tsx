"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { trpc } from "~/app/_trpc/client";
import { Button } from "./ui/moving-border";
import toast from "react-hot-toast";

type Inputs = {
  content: string;
};

const schema = z.object({
  content: z.string().min(2),
});

function CommentForm({ postId }: { postId: string }) {
  const { user } = useKindeBrowserClient();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const mutation = trpc.commentOnPost.useMutation({
    onSettled: async () => {
      router.refresh();
    },
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: () => {
      toast.success("Comment posted!");
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (!user) return null;
    mutation.mutate({
      content: data.content,
      postId: postId,
      authorId: user.id,
      authorName: user.given_name + " " + user.family_name,
    });

    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <textarea
        disabled={mutation.isPending}
        {...register("content")}
        className="w-full rounded-md text-zinc-300 bg-slate-800 resize-none p-4 outline outline-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
        placeholder="Comment..."
        rows={4}
      />
      {errors.content && (
        <p className="text-sm text-red-400 my-2">{errors.content.message}</p>
      )}
      <div className="mt-4 flex justify-end">
        <Button
          type="submit"
          className="w-full hover:opacity-75 transition-opacity duration-150 ease-in"
        >
          {mutation.isPending ? "Posting..." : "Post comment"}
        </Button>
      </div>
    </form>
  );
}

export default CommentForm;
