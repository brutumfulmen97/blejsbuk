"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "~/app/_trpc/client";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { Suspense, useRef, useState } from "react";
import { ForwardRefEditor } from "./Editor/ForwardRefEditor";
import toast from "react-hot-toast";
import { UploadButton } from "~/utils/uploadthing";
import Image from "next/image";

type Inputs = {
  title: string;
};

const schema = z.object({
  title: z.string().min(2),
});

const Form = ({
  orientation = "portrait",
}: {
  orientation: "portrait" | "landscape";
}) => {
  const router = useRouter();
  const [markdown, setMarkdown] = useState("");
  const [file, setFile] = useState("");
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
      imageUrl: file,
    });
  };

  const mutation = trpc.submitPost.useMutation({
    onSettled: () => {
      toast.success("Post submitted!");
      router.push("/");
      router.refresh();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <>
      <form
        className={clsx(
          "mb-12 p-8 items-center rounded-md bg-slate-800 text-white outline outline-slate-500 max-w-[400px] w-[80vw]",
          orientation === "portrait"
            ? "flex flex-col gap-2"
            : "w-full flex flex-col gap-8"
        )}
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="w-full pb-4 text-center text-xl md:text-3xl border-b border-slate-500">
          What&apos;s on your mind...
        </h2>
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
        <Suspense fallback={<div />}>
          <ForwardRefEditor
            ref={editorRef}
            markdown={markdown}
            className="bg-white rounded-md min-h-60 p-4"
            onChange={(m) => {
              setMarkdown(m);
            }}
          />
        </Suspense>
        <UploadButton
          className="mt-2"
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            setFile(res[0].url);
          }}
          onUploadError={(err) => {
            toast.error(err.message);
          }}
        />
        {file && (
          <Image
            src={file}
            alt="uploaded image"
            width={200}
            height={200}
            className="w-full h-auto"
          />
        )}
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-teal-600 hover:bg-teal-800 rounded-md"
        >
          SUBMIT
        </button>
      </form>
    </>
  );
};

export default Form;
