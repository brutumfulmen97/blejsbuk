"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FC, Suspense, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { trpc } from "~/app/_trpc/client";
import { ForwardRefEditor } from "./Editor/ForwardRefEditor";

type Inputs = {
  title: string;
  content: string;
};

const schema = z.object({
  title: z.string().min(2),
});

interface PostEditFormProps {
  post: {
    id: string;
    title: string;
    content: string;
    authorId: string;
    createdAt: Date;
  };
}

const PostEditForm: FC<PostEditFormProps> = ({ post }) => {
  const router = useRouter();
  const [markdown, setMarkdown] = useState(post.content);
  const editorRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutation.mutate({ ...data, content: markdown, id: post.id });
  };

  const mutation = trpc.editPost.useMutation({
    onSettled: () => {
      router.push("/");
      router.refresh();
    },
  });

  return (
    <form
      className="mb-12 p-8 items-center rounded-md bg-slate-800 text-white outline outline-slate-500 flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <label htmlFor="title">Title</label>
      <input
        placeholder="..."
        className="text-slate-100 px-4 py-1 rounded-md w-full bg-[rgb(255,255,255,0.2)]"
        type="text"
        defaultValue={post.title}
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
        EDIT
      </button>
    </form>
  );
};

export default PostEditForm;
