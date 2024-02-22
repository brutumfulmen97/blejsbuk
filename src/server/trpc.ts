import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import type { Context } from "./auth-context";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter: (err) => {
    return err.shape;
  },
});

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.auth?.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      auth: ctx.auth,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
export const createCallerFactory = t.createCallerFactory;
