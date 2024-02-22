import { TRPCError } from "@trpc/server";
import { publicProcedure, protectedProcedure, router } from "./trpc";
import z from "zod";
import prisma from "~/lib/prisma";

export const appRouter = router({
  getPosts: publicProcedure.query(async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return await prisma?.post.findMany();
  }),
  getPostsByUser: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.auth.userId) {
      throw new TRPCError({
        message: "You must be logged in to view your posts.",
        code: "UNAUTHORIZED",
      });
    }

    return await prisma?.post.findMany({
      where: {
        authorId: ctx.auth.userId,
      },
    });
  }),
  getUsers: publicProcedure.query(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const users = [
      { id: 1, name: "John" },
      { id: 2, name: "Jane" },
    ];

    return users;
  }),
  hello: protectedProcedure.query(({ ctx }) => {
    return {
      secret: `${ctx.auth?.userId} is using a protected procedure`,
    };
  }),
  submitPost: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth.userId) {
        throw new TRPCError({
          message: "You must be logged in to create a post.",
          code: "UNAUTHORIZED",
        });
      }

      await prisma?.post.create({
        data: {
          title: input.title,
          content: input.content,
          authorId: ctx.auth.userId,
        },
      });

      return {
        success: true,
      };
    }),
});

export type AppRouter = typeof appRouter;
