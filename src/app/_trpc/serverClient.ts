import { appRouter } from "~/server";
import { createCallerFactory } from "~/server/trpc";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const createCaller = createCallerFactory(appRouter);

//@ts-ignore
const { getUser } = await getKindeServerSession();
//@ts-ignore
const user = await getUser();

export const serverClient = createCaller({
  auth: user,
});
