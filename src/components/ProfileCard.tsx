import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/dist/types";
import { FC } from "react";

interface ProfileCardProps {
  user: KindeUser;
}

const ProfileCard: FC<ProfileCardProps> = ({ user }) => {
  return (
    <div className="w-full p-4 rounded-md bg-slate-700 mb-8">
      <h1>
        Hello, {user.given_name} {user.family_name}!
      </h1>
    </div>
  );
};

export default ProfileCard;
