"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { trpc } from "~/app/_trpc/client";

type Inputs = {
  name: string;
  description: string;
};

const schema = z.object({
  name: z.string().min(2),
  description: z.string().min(2),
});

function CreateCommunityForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ resolver: zodResolver(schema) });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutation.mutate(data);
  };

  const mutation = trpc.createSubreddit.useMutation({
    onSettled: () => {
      router.push("/");
      router.refresh();
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 items-end justify-end"
    >
      <input
        type="text"
        {...register("name")}
        placeholder="name"
        className="text-black p-2 rounded-md w-full"
      />
      <textarea
        rows={5}
        {...register("description")}
        placeholder="description"
        className="text-black p-2 rounded-md w-full"
      />
      <button
        type="submit"
        className="rounded-md py-2 px-4 bg-teal-600 hover:bg-teal-800"
      >
        Create community
      </button>
    </form>
  );
}

export default CreateCommunityForm;
