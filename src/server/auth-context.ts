import * as trpcNext from "@trpc/server/adapters/next";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/dist/types";

interface AuthContext {
  auth: KindeUser | null;
}

export const createContextInner = async ({ auth }: AuthContext) => {
  return {
    auth,
  };
};

export const createContext = async (
  opts: trpcNext.CreateNextContextOptions
) => {
  const { getUser } = await getKindeServerSession();
  const user = await getUser();

  return await createContextInner({ auth: user });
};

export type Context = Awaited<ReturnType<typeof createContext>>;
