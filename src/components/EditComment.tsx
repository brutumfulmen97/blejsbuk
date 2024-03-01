import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, SquareDashedBottomIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, FC, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { trpc } from "~/app/_trpc/client";

interface EditCommentProps {
  content: string;
  commentId: string;
  setIsInEditMode: Dispatch<SetStateAction<boolean>>;
}

type Inputs = {
  content: string;
};

const schema = z.object({
  content: z.string().min(1),
});

const EditComment: FC<EditCommentProps> = ({
  content,
  commentId,
  setIsInEditMode,
}) => {
  const router = useRouter();
  const mutation = trpc.editComment.useMutation({
    onSettled: () => {
      reset();
      router.refresh();
      setIsInEditMode(false);
    },
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: () => {
      toast.success("Comment edited!");
    },
  });

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: Inputs) => {
    mutation.mutate({
      content: data.content,
      id: commentId,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full flex gap-2">
      <div className="w-full">
        <input
          className="w-full rounded-md py-1 px-2 bg-slate-800 text-slate-100"
          type="text"
          defaultValue={content}
          {...register("content")}
          placeholder={content}
        />
        {errors.content && (
          <p className="text-red-500 text-xs">This field is required</p>
        )}
      </div>
      <button
        type="submit"
        className="py-1 px-2 rounded-md border border-slate-200 hover:bg-slate-800"
      >
        {mutation.isPending ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <SquareDashedBottomIcon size={16} />
        )}
      </button>
    </form>
  );
};

export default EditComment;
