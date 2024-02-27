"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "~/app/_trpc/client";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { Suspense, useRef, useState } from "react";
import { ForwardRefEditor } from "./Editor/ForwardRefEditor";
import { ChevronDown, Loader2, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { UploadButton } from "~/utils/uploadthing";
import Image from "next/image";

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
  const [file, setFile] = useState("");
  const editorRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutation.mutate({
      title: data.title,
      content: markdown,
      subredditId: communityId,
      imageUrl: file ?? "",
    });
  };

  const utils = trpc.useUtils();

  const mutation = trpc.submitPost.useMutation({
    onSettled: () => {
      router.refresh();
      reset();
      setMarkdown("");
      setIsHidden(true);
      utils.getPostsByCommunity.invalidate();
    },
    onSuccess: () => {
      toast.success("Posted!");
    },
    onError: (err) => {
      toast.error(err.message);
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
          <div className="relative">
            <XCircle
              size={24}
              fill="#000"
              className="absolute top-2 right-2 z-10 hover:opacity-50 cursor-pointer"
              onClick={() => setFile("")}
            />
            <Image
              src={file}
              alt="uploaded image"
              width={200}
              height={200}
              className="w-full h-auto"
            />
          </div>
        )}
        <button
          type="submit"
          className="flex justify-center mt-4 px-4 py-2 bg-teal-600 hover:bg-teal-800 rounded-md"
        >
          {mutation.isPending ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            "SUBMIT"
          )}
        </button>
      </div>
    </form>
  );
}

export default PostToCommunity;
