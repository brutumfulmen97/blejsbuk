import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { FC } from "react";
import { serverClient } from "~/app/_trpc/serverClient";
import EditUserForm from "~/components/User/EditUserForm";

interface pageProps {
  params: {
    id?: string;
  };
}

const page: FC<pageProps> = async ({ params }) => {
  if (params.id) {
    const user = await serverClient.getUserById({ id: params.id });

    if (user)
      return (
        <div>
          <p>{user.username}</p>
          <EditUserForm
            userId={user.id}
            username={user.username ?? ""}
            profilePicture={user.profilePicture ?? ""}
            bio={user.bio ?? ""}
          />
        </div>
      );
  }

  const { getUser } = await getKindeServerSession();

  const user = await getUser();

  if (!user) redirect("/login");

  return (
    <div>
      <EditUserForm userId={user.id} />
    </div>
  );
};

export default page;
