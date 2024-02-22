"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "~/app/_trpc/client";
import { useRouter } from "next/navigation";
import clsx from "clsx";

type Inputs = {
  title: string;
  content: string;
};

const schema = z.object({
  title: z.string().min(2),
  content: z.string().min(2),
});

const Form = ({
  orientation = "portrait",
}: {
  orientation: "portrait" | "landscape";
}) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutation.mutate(data);
  };

  const mutation = trpc.submitPost.useMutation({
    onSettled: () => {
      router.push("/");
      router.refresh();
    },
  });

  return (
    <form
      className={clsx(
        "mb-12 p-8 items-center rounded-md bg-slate-800 text-white outline outline-slate-500",
        orientation === "portrait"
          ? "w-[400px] flex flex-col gap-8"
          : "w-full flex flex-col gap-8"
      )}
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="w-full pb-4 text-center text-3xl border-b border-slate-500">
        What&apos;s on your mind...
      </h2>
      <label htmlFor="title">Title</label>
      <input
        placeholder="..."
        className="text-slate-100 px-4 py-1 rounded-md w-full bg-[rgb(255,255,255,0.2)]"
        type="text"
        defaultValue=""
        {...register("title")}
      />
      {errors.title && (
        <span className="text-red-400 font-bold">
          This field needs to be at least 2 chars long...
        </span>
      )}
      <label htmlFor="content">Content</label>
      <textarea
        rows={6}
        placeholder="..."
        className="text-slate-100 px-4 py-1 rounded-md w-full resize-none bg-[rgb(255,255,255,0.2)]"
        defaultValue=""
        {...register("content")}
      />
      {errors.content && (
        <span className="text-red-400 font-bold">
          This field needs to be at least 2 chars long...
        </span>
      )}
      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-teal-600 hover:bg-teal-800 rounded-md"
      >
        SUBMIT
      </button>
    </form>
  );
};

export default Form;
