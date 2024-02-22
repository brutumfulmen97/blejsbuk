import { appRouter } from "~/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const handler = async (req: Request) => {
  const { getUser } = await getKindeServerSession();
  const user = await getUser();

  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({
      auth: user,
    }),
  });
};

export { handler as GET, handler as POST };
