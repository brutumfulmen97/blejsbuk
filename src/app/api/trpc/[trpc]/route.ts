import { appRouter } from "~/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { auth } from "@clerk/nextjs";

const handler = async (req: Request) => {
  const authentication = await auth();
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({
      auth: authentication,
    }),
  });
};

export { handler as GET, handler as POST };
