import { TRPCError } from "@trpc/server";
import { publicProcedure, protectedProcedure, router } from "./trpc";
import z from "zod";
import prisma from "~/lib/prisma";

export const appRouter = router({
  getPosts: publicProcedure.query(async () => {
    return await prisma?.post.findMany({
      orderBy: { createdAt: "desc" },
      include: { Subreddit: true },
    });
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
  getPostsByUser: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      if (!input.id) {
        throw new TRPCError({
          message: "You must provide an id to get the posts of a user.",
          code: "BAD_REQUEST",
        });
      }
      return await prisma?.post.findMany({
        where: {
          authorId: input?.id,
        },
      });
    }),
  editPost: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.auth?.id) {
        throw new TRPCError({
          message: "You must be logged in to edit a post.",
          code: "UNAUTHORIZED",
        });
      }

      const post = await prisma?.post.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!post) {
        throw new TRPCError({
          message: "Post not found.",
          code: "NOT_FOUND",
        });
      }

      if (post.authorId != ctx.auth.id) {
        throw new TRPCError({
          message: "You are not authorized to edit this post.",
          code: "FORBIDDEN",
        });
      }

      await prisma?.post.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          content: input.content,
        },
      });

      return {
        success: true,
      };
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
        subredditId: z.string().optional(),
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

      try {
        await prisma?.post.create({
          data: {
            title: input.title,
            content: input.content,
            authorId: ctx.auth.id,
            authorName: ctx.auth.given_name + " " + ctx.auth.family_name,
            subredditId: input.subredditId ?? "general",
          },
        });
        return {
          success: true,
        };
      } catch (e) {
        console.log(e);
        return {
          success: false,
        };
      }
    }),
  createSubreddit: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth?.id) {
        throw new TRPCError({
          message: "You must be logged in to create a post.",
          code: "UNAUTHORIZED",
        });
      }

      try {
        await prisma?.subreddit.create({
          data: {
            name: input.name,
            description: input.description,
            authorId: ctx.auth.id,
            authorName: ctx.auth.given_name + " " + ctx.auth.family_name,
          },
        });
        return {
          success: true,
        };
      } catch (e) {
        console.log(e);
        return {
          success: false,
        };
      }
    }),
  getCommunity: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await prisma?.subreddit.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  getCommunities: publicProcedure.query(async () => {
    return await prisma?.subreddit.findMany();
  }),
  getFilteredCommunities: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return await prisma?.subreddit.findMany({
        where: {
          name: {
            contains: input,
          },
        },
      });
    }),
});

export type AppRouter = typeof appRouter;
