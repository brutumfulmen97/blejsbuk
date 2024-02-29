import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/dist/types";
import { FC } from "react";

interface ProfileCardProps {
  user: KindeUser;
}

const ProfileCard: FC<ProfileCardProps> = ({ user }) => {
  return (
    <div className="w-full p-4 rounded-md bg-slate-900 mb-8">
      <h1 className="text-xl">
        Hello,{" "}
        <span className="text-slate-300 font-bold capitalize">
          {user.given_name}
        </span>{" "}
        <span className="text-slate-300 font-bold capitalize">
          {user.family_name}!
        </span>
      </h1>
    </div>
  );
};

export default ProfileCard;
