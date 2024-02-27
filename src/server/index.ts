import { TRPCError } from "@trpc/server";
import { publicProcedure, protectedProcedure, router } from "./trpc";
import z from "zod";
import prisma from "~/lib/prisma";

export const appRouter = router({
  getPosts: publicProcedure.query(async () => {
    return await prisma?.post.findMany({
      orderBy: { createdAt: "desc" },
      include: { Subreddit: true, Votes: true },
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
        include: { Subreddit: true, Votes: true },
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
        include: { Subreddit: true, Votes: true },
        orderBy: { createdAt: "desc" },
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
            name: input.name.toLowerCase(),
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
    .input(
      z.object({
        input: z.string(),
      })
    )
    .query(async ({ input }) => {
      if (input.input === "") return [];
      return await prisma?.subreddit.findMany({
        where: {
          name: {
            contains: input.input.toLowerCase(),
          },
        },
      });
    }),
  getPostsByCommunity: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await prisma?.post.findMany({
        where: {
          subredditId: input.id,
        },
        include: { Subreddit: true, Votes: true },
        orderBy: { createdAt: "desc" },
      });
    }),
  commentOnPost: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        postId: z.string(),
        authorId: z.string(),
        authorName: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth?.id) {
        throw new TRPCError({
          message: "You must be logged in to comment on a post.",
          code: "UNAUTHORIZED",
        });
      }

      await prisma?.comment.create({
        data: {
          content: input.content,
          postId: input.postId,
          authorId: ctx.auth.id,
          authorName: ctx.auth.given_name + " " + ctx.auth.family_name,
        },
      });

      return {
        success: true,
      };
    }),
  getCommentsByPost: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await prisma?.comment.findMany({
        where: {
          postId: input.id,
        },
      });
    }),
  editCommunityMembers: protectedProcedure
    .input(z.object({ id: z.string(), action: z.enum(["join", "leave"]) }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth?.id) {
        throw new TRPCError({
          message: "You must be logged in to join a community.",
          code: "UNAUTHORIZED",
        });
      }

      const prevState = await prisma?.subreddit.findUnique({
        where: {
          id: input.id,
        },
      });

      await prisma?.subreddit.update({
        where: {
          id: input.id,
        },
        data: {
          members:
            input.action === "join"
              ? prevState?.members
                ? [...prevState.members, ctx.auth.id]
                : [ctx.auth.id]
              : prevState?.members.filter((m) => m !== ctx.auth.id),
        },
      });
      return {
        success: true,
      };
    }),
  getLikesForPost: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await prisma?.vote.findMany({
        where: {
          postId: input.id,
        },
      });
    }),
  likePost: protectedProcedure
    .input(z.object({ postId: z.string(), type: z.enum(["UP", "DOWN"]) }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth?.id) {
        throw new TRPCError({
          message: "You must be logged in to like a post.",
          code: "UNAUTHORIZED",
        });
      }

      const prevVote = await prisma?.vote.findFirst({
        where: {
          postId: input.postId,
          authorId: ctx.auth.id,
        },
      });

      if (prevVote) {
        if (prevVote.type === input.type) {
          await prisma?.vote.delete({
            where: {
              id: prevVote.id,
            },
          });
          return {
            success: true,
          };
        } else {
          await prisma?.vote.update({
            where: {
              id: prevVote.id,
            },
            data: {
              type: input.type,
            },
          });
          return {
            success: true,
          };
        }
      }

      return {
        success: true,
      };
    }),
});

export type AppRouter = typeof appRouter;
