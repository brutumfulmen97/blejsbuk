import { appRouter } from "~/server";
import { createCallerFactory } from "~/server/trpc";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const createCaller = createCallerFactory(appRouter);

//@ts-ignore
const authentication = await getKindeServerSession();

export const serverClient = createCaller({
  auth: authentication,
});
