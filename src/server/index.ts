import { TRPCError } from "@trpc/server";
import { publicProcedure, protectedProcedure, router } from "./trpc";
import z from "zod";
import prisma from "~/lib/prisma";

export const appRouter = router({
  getPosts: publicProcedure.query(async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return await prisma?.post.findMany();
  }),
  getPostById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await prisma?.post.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  getPostsByUser: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.auth?.id) {
      throw new TRPCError({
        message: "You must be logged in to view your posts.",
        code: "UNAUTHORIZED",
      });
    }

    return await prisma?.post.findMany({
      where: {
        authorId: ctx.auth?.id,
      },
    });
  }),
  deletePost: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        authorId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth?.id) {
        throw new TRPCError({
          message: "You must be logged in to delete a post.",
          code: "UNAUTHORIZED",
        });
      }

      if (ctx.auth.id != input.authorId) {
        throw new TRPCError({
          message: "You are not authorized to delete this post.",
          code: "FORBIDDEN",
        });
      }

      await prisma?.post.delete({
        where: {
          id: input.id,
        },
      });

      return {
        success: true,
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
      if (!ctx.auth?.id) {
        throw new TRPCError({
          message: "You must be logged in to create a post.",
          code: "UNAUTHORIZED",
        });
      }

      await prisma?.post.create({
        data: {
          title: input.title,
          content: input.content,
          authorId: ctx.auth.id,
          authorName: ctx.auth.given_name + " " + ctx.auth.family_name,
        },
      });

      return {
        success: true,
      };
    }),
});

export type AppRouter = typeof appRouter;
