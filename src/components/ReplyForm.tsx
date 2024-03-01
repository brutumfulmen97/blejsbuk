import { FC } from "react";
import { ArrowBigRight } from "lucide-react";
import clsx from "clsx";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "~/app/_trpc/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface ReplyFormProps {
  isHidden: boolean;
  parentId: string;
  postId: string;
}

type Inputs = {
  content: string;
};

const schema = z.object({
  content: z.string().min(1),
});

const ReplyForm: FC<ReplyFormProps> = ({ isHidden, parentId, postId }) => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutation.mutate({
      content: data.content,
      parentId,
      postId,
    });
  };

  const mutation = trpc.replyToComment.useMutation({
    onSettled: () => {
      router.refresh();
      reset();
    },
    onSuccess: () => {
      toast.success("Replied!");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={clsx(
        "flex items-start justify-between gap-4 my-2",
        isHidden ? "hidden" : ""
      )}
    >
      {/*TODO click outside */}
      <div className="w-full">
        <textarea
          {...register("content")}
          name="content"
          placeholder="Reply to comment..."
          rows={3}
          className="resize-y bg-slate-800 w-full rounded-md p-2 color-slate-200"
        ></textarea>
        {errors.content && (
          <p className="text-red-500 text-xs text-center">
            Content is required
          </p>
        )}
      </div>
      <button
        type="submit"
        className="p-2 border border-slate-100 rounded-md mt-1 hover:bg-slate-800 cursor-pointer"
      >
        <ArrowBigRight size={20} />
      </button>
    </form>
  );
};

export default ReplyForm;
