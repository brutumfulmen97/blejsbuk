import { Edit2, User2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { serverClient } from "~/app/_trpc/serverClient";

interface ProfileCardProps {
  userId: string;
}

const ProfileCard: FC<ProfileCardProps> = async ({ userId }) => {
  const user = await serverClient.getUserById({ id: userId });

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full relative flex p-4 rounded-md bg-slate-900 mb-8 gap-4">
      <div>
        {user?.profilePicture ? (
          <Image
            src={user?.profilePicture}
            alt="profile picture"
            width={48}
            height={48}
            className="rounded-full ring-2 ring-slate-300"
          />
        ) : (
          <User2 size={48} className="rounded-full ring-2 ring-slate-300" />
        )}
      </div>
      <div>
        <h1 className="text-xl">
          Hello,{" "}
          <span className="text-slate-300 font-bold capitalize">
            {user?.username}
          </span>
        </h1>
        <p className="text-slate-300 mt-2">{user?.bio}!</p>
      </div>
      <Link href={`/profile/edit/${userId}`} className="absolute top-4 right-4">
        <Edit2 size={20} className="hover:opacity-70 cursor-pointer" />
      </Link>
    </div>
  );
};

export default ProfileCard;
