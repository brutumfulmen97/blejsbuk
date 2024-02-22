import * as trpcNext from "@trpc/server/adapters/next";
import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";

interface AuthContext {
  auth: any;
}

export const createContextInner = async ({ auth }: AuthContext) => {
  return {
    auth,
  };
};

export const createContext = async (
  opts: trpcNext.CreateNextContextOptions
) => {
  return await createContextInner({ auth: withAuth(opts.req) });
};

export type Context = Awaited<ReturnType<typeof createContext>>;
