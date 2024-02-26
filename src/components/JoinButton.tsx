"use client";

import { Loader2, Plus, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC } from "react";
import toast from "react-hot-toast";
import { trpc } from "~/app/_trpc/client";

interface JoinButtonProps {
  userId: string;
  communityId: string;
  members: string[];
}

const JoinButton: FC<JoinButtonProps> = ({ userId, communityId, members }) => {
  const router = useRouter();

  const mutation = trpc.editCommunityMembers.useMutation({
    onSettled: () => {
      toast.success("Community joined!");
      router.refresh();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  if (!members || !members?.includes(userId)) {
    return (
      <div
        className="p-2 ml-8 flex gap-2 items-center rounded-md bg-slate-800 hover:bg-slate-900 cursor-pointer"
        onClick={() => {
          mutation.mutate({
            id: communityId,
            action: "join",
          });
        }}
      >
        <p>Join the community</p>
        {mutation.isPending ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <Plus size={20} />
        )}
      </div>
    );
  }

  return (
    <div
      className="hover:bg-slate-900 cursor-pointer p-2 flex gap-2 items-center rounded-md bg-slate-800"
      onClick={() => {
        mutation.mutate({
          id: communityId,
          action: "leave",
        });
      }}
    >
      <p>Leave the community</p>
      {mutation.isPending ? (
        <Loader2 size={20} className="animate-spin" />
      ) : (
        <XCircle size={20} />
      )}
    </div>
  );
};

export default JoinButton;
