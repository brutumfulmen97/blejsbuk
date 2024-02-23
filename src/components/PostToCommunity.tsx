"use client";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "~/app/_trpc/client";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { Suspense, useRef, useState } from "react";
import { ForwardRefEditor } from "./Editor/ForwardRefEditor";
import { ChevronDown } from "lucide-react";

type Inputs = {
  title: string;
};

const schema = z.object({
  title: z.string().min(2),
});

function PostToCommunity({ communityId }: { communityId: string }) {
  const router = useRouter();
  const [markdown, setMarkdown] = useState("");
  const [isHidden, setIsHidden] = useState(true);
  const editorRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutation.mutate({
      title: data.title,
      content: markdown,
      subredditId: communityId,
    });
  };

  const mutation = trpc.submitPost.useMutation({
    onSettled: () => {
      router.push("/");
      router.refresh();
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className=" mt-4 bg-slate-900 rounded-md p-4 cursor-pointer hover:bg-slate-800"
      onClick={() => setIsHidden(false)}
    >
      <h2 className="w-full pb-4 text-center text-2xl">
        What&apos;s on your mind?
      </h2>
      {isHidden && (
        <div className="flex justify-center">
          <ChevronDown size={36} />
        </div>
      )}
      <div
        className={clsx(!isHidden ? "flex flex-col gap-2 w-full" : "hidden")}
      >
        <label htmlFor="title">Title</label>
        <input
          placeholder="..."
          className="text-[#60646c] px-4 py-1 rounded-md w-full bg-white"
          type="text"
          defaultValue=""
          {...register("title")}
        />
        {errors.title && (
          <span className="text-red-400 font-bold">
            This field needs to be at least 2 chars long...
          </span>
        )}
        <label>Content</label>
        <Suspense fallback={<div>Loading...</div>}>
          <ForwardRefEditor
            ref={editorRef}
            markdown={markdown}
            className="bg-white rounded-md min-h-48 p-4"
            onChange={(m) => {
              setMarkdown(m);
            }}
          />
        </Suspense>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-teal-600 hover:bg-teal-800 rounded-md"
        >
          SUBMIT
        </button>
      </div>
    </form>
  );
}

export default PostToCommunity;
