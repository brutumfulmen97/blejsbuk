import { appRouter } from "~/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import cors from "nextjs-cors";
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest } from "next";

const handler = async (req: NextRequest, res: NextResponse) => {
  //@ts-ignore
  await cors(req, res);
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
