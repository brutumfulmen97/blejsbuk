"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { trpc } from "~/app/_trpc/client";

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
    onSettled: () => {
      router.refresh();
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
        {...register("content")}
        className="w-full rounded-md text-zinc-300 bg-slate-800 resize-none p-4 outline outline-slate-500"
        placeholder="Comment..."
        rows={4}
      />
      {errors.content && (
        <p className="text-sm text-red-400 my-2">{errors.content.message}</p>
      )}
      <button
        type="submit"
        className="w-full rounded-md bg-teal-700 py-2 mt-2 hover:bg-teal-500 outline outline-amber-700"
      >
        {mutation.isPending ? "Posting..." : "Post comment"}
      </button>
    </form>
  );
}

export default CommentForm;
