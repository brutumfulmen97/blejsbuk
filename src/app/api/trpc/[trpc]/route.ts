import { appRouter } from "~/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const handler = async (req: Request) => {
  const authentication = await getKindeServerSession();
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
