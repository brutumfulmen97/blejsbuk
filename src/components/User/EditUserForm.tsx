"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { XCircle } from "lucide-react";
import { FC } from "react";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { trpc } from "~/app/_trpc/client";
import { UploadDropzone } from "~/utils/uploadthing";
import { useRouter } from "next/navigation";

interface EditUserFormProps {
  userId: string;
  username?: string;
  profilePicture?: string;
  bio?: string;
}

type Inputs = {
  username: string;
  profilePicture: string;
  bio: string;
};

const schema = z.object({
  username: z.string().min(2),
  profilePicture: z.string().url().optional(),
  bio: z.string().max(200),
});

const EditUserForm: FC<EditUserFormProps> = ({
  userId,
  username,
  profilePicture,
  bio,
}) => {
  const router = useRouter();

  const mutation = trpc.editUserProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile updated!");
    },
    onSettled: () => {
      router.push(`/profile/${userId}`);
      router.refresh();
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: username ?? "",
      profilePicture: profilePicture ?? "",
      bio: bio ?? "",
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutation.mutate({
      username: data.username,
      profilePicture: data.profilePicture,
      bio: data.bio,
    });
  };

  const profilePic = watch("profilePicture");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center justify-center gap-4 max-w-[500px] mx-auto p-4 rounded-md bg-neutral-800"
    >
      <label htmlFor="username">Username</label>
      <input
        {...register("username")}
        type="text"
        className="text-[#60646c] px-4 py-1 rounded-md w-full bg-white"
      />
      {errors.username && (
        <p className="text-red-400 text-sm">{errors.username.message}</p>
      )}
      <label htmlFor="bio">Bio</label>
      <textarea
        {...register("bio")}
        cols={30}
        rows={10}
        className="text-[#60646c] px-4 py-1 rounded-md w-full bg-white"
      ></textarea>
      {errors.bio && (
        <p className="text-red-400 text-sm">{errors.bio.message}</p>
      )}
      <UploadDropzone
        className="mt-2"
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          setValue("profilePicture", res[0].url);
        }}
        onUploadError={(e) => toast.error(e.message)}
      />
      {profilePic && (
        <div className="relative">
          <XCircle
            size={24}
            fill="#000"
            className="absolute top-2 right-2 z-10 hover:opacity-50 cursor-pointer"
            onClick={() => setValue("profilePicture", "")}
          />
          <Image
            src={profilePic ?? ""}
            alt="uploaded image"
            width={500}
            height={500}
            className="w-full h-auto"
          />
        </div>
      )}
      <button
        type="submit"
        className="mt-4 w-full py-2 bg-slate-600 hover:bg-teal-800 rounded-lg  outline outline-slate-400 hover:outline-slate-200"
      >
        SUBMIT
      </button>
    </form>
  );
};

export default EditUserForm;
