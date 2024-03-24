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
        include: { Subreddit: true, Votes: true, Comments: true },
        orderBy: { createdAt: "desc" },
      });
    }),
  editPost: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        content: z.string(),
        imageUrl: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.auth?.id) {
        throw new TRPCError({
          message: "You must be logged in to edit a post.",
          code: "UNAUTHORIZED",
        });
      }

      const user = await prisma?.user.findUnique({
        where: {
          id: ctx.auth?.id,
        },
      });

      if (!user) {
        throw new TRPCError({
          message: "User not found.",
          code: "NOT_FOUND",
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
          imageUrl: input.imageUrl,
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

      const user = await prisma?.user.findUnique({
        where: {
          id: ctx.auth?.id,
        },
      });

      if (!user) {
        throw new TRPCError({
          message: "User not found.",
          code: "NOT_FOUND",
        });
      }

      try {
        await prisma?.post.delete({
          where: {
            id: input.id,
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
  submitPost: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        subredditId: z.string().optional(),
        content: z.string(),
        imageUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth?.id) {
        throw new TRPCError({
          message: "You must be logged in to create a post.",
          code: "UNAUTHORIZED",
        });
      }

      const user = await prisma?.user.findUnique({
        where: {
          id: ctx.auth?.id,
        },
      });

      if (!user) {
        throw new TRPCError({
          message: "User not found.",
          code: "NOT_FOUND",
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
            imageUrl: input.imageUrl ?? "",
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

      const user = await prisma?.user.findUnique({
        where: {
          id: ctx.auth?.id,
        },
      });

      if (!user) {
        throw new TRPCError({
          message: "User not found.",
          code: "NOT_FOUND",
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

      const user = await prisma?.user.findUnique({
        where: {
          id: ctx.auth?.id,
        },
      });

      if (!user) {
        throw new TRPCError({
          message: "User not found.",
          code: "NOT_FOUND",
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
        include: { Votes: true, Comments: true },
      });
    }),
  voteOnComment: protectedProcedure
    .input(
      z.object({
        commentId: z.string(),
        type: z.enum(["UP", "DOWN"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.auth?.id) {
        throw new TRPCError({
          message: "You must be logged in to vote on a comment.",
          code: "UNAUTHORIZED",
        });
      }

      const user = await prisma?.user.findUnique({
        where: {
          id: ctx.auth?.id,
        },
      });

      if (!user) {
        throw new TRPCError({
          message: "User not found.",
          code: "NOT_FOUND",
        });
      }

      const prevVote = await prisma?.commentVote.findFirst({
        where: {
          commentId: input.commentId,
          authorId: ctx.auth.id,
        },
      });

      if (prevVote) {
        if (prevVote.type === input.type) {
          await prisma?.commentVote.delete({
            where: {
              id: prevVote.id,
            },
          });
          return {
            success: true,
          };
        } else {
          await prisma?.commentVote.update({
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
      } else {
        await prisma?.commentVote.create({
          data: {
            commentId: input.commentId,
            authorName: ctx.auth.given_name + " " + ctx.auth.family_name,
            authorId: ctx.auth.id,
            type: input.type,
          },
        });
      }

      return {
        success: true,
      };
    }),
  replyToComment: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        parentId: z.string(),
        postId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.auth?.id) {
        throw new TRPCError({
          message: "You must be logged in to reply to a comment.",
          code: "UNAUTHORIZED",
        });
      }

      const user = await prisma?.user.findUnique({
        where: {
          id: ctx.auth?.id,
        },
      });

      if (!user) {
        throw new TRPCError({
          message: "User not found.",
          code: "NOT_FOUND",
        });
      }

      await prisma?.comment.create({
        data: {
          content: input.content,
          parentId: input.parentId,
          postId: input.postId,
          authorId: ctx.auth.id,
          authorName: ctx.auth.given_name + " " + ctx.auth.family_name,
        },
      });

      return {
        success: true,
      };
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

      const user = await prisma?.user.findUnique({
        where: {
          id: ctx.auth?.id,
        },
      });

      if (!user) {
        throw new TRPCError({
          message: "User not found.",
          code: "NOT_FOUND",
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
  editComment: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth?.id) {
        throw new TRPCError({
          message: "You must be logged in to edit a comment.",
          code: "UNAUTHORIZED",
        });
      }

      const user = await prisma?.user.findUnique({
        where: {
          id: ctx.auth?.id,
        },
      });

      if (!user) {
        throw new TRPCError({
          message: "User not found.",
          code: "NOT_FOUND",
        });
      }

      const comment = await prisma?.comment.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!comment) {
        throw new TRPCError({
          message: "Comment not found.",
          code: "NOT_FOUND",
        });
      }

      if (comment.authorId != ctx.auth.id) {
        throw new TRPCError({
          message: "You are not authorized to edit this comment.",
          code: "FORBIDDEN",
        });
      }

      await prisma?.comment.update({
        where: {
          id: input.id,
        },
        data: {
          content: input.content,
        },
      });

      return {
        success: true,
      };
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

      const user = await prisma?.user.findUnique({
        where: {
          id: ctx.auth?.id,
        },
      });

      if (!user) {
        throw new TRPCError({
          message: "User not found.",
          code: "NOT_FOUND",
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
      } else {
        await prisma?.vote.create({
          data: {
            postId: input.postId,
            authorName: ctx.auth.given_name + " " + ctx.auth.family_name,
            authorId: ctx.auth.id,
            type: input.type,
          },
        });
      }

      return {
        success: true,
      };
    }),
  infinitePosts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ input }) => {
      const limit = input.limit ?? 20;
      const { cursor } = input;

      const posts = await prisma.post.findMany({
        take: limit + 1,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: "desc" },
        include: { Subreddit: true, Votes: true, Comments: true },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem?.id;
      }

      return {
        posts,
        nextCursor,
      };
    }),
  editUserProfile: protectedProcedure
    .input(
      z.object({
        username: z.string(),
        bio: z.string(),
        profilePicture: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth?.id) {
        throw new TRPCError({
          message: "You must be logged in to create a post.",
          code: "UNAUTHORIZED",
        });
      }

      const user = await prisma?.user.findUnique({
        where: {
          id: ctx.auth?.id,
        },
      });

      if (!user) {
        await prisma?.user.create({
          data: {
            id: ctx.auth.id,
            username: input.username,
            bio: input.bio,
            profilePicture: input.profilePicture ?? "",
          },
        });
      } else {
        await prisma?.user.update({
          where: {
            id: ctx.auth.id,
          },
          data: {
            username: input.username,
            bio: input.bio,
            profilePicture: input.profilePicture ?? "",
          },
        });
      }
    }),
  getUserById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await prisma?.user.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  savePost: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth?.id) {
        throw new TRPCError({
          message: "You must be logged in to save a post.",
          code: "UNAUTHORIZED",
        });
      }

      const user = await prisma?.user.findUnique({
        where: {
          id: ctx.auth?.id,
        },
      });

      if (!user) {
        throw new TRPCError({
          message: "User not found.",
          code: "NOT_FOUND",
        });
      }

      const post = await prisma?.post.findUnique({
        where: {
          id: input.postId,
        },
      });

      if (!post) {
        throw new TRPCError({
          message: "Post not found.",
          code: "NOT_FOUND",
        });
      }

      if (user.SavedPosts.includes(input.postId)) {
        await prisma?.user.update({
          where: {
            id: ctx.auth.id,
          },
          data: {
            SavedPosts: user.SavedPosts.filter((id) => id !== input.postId),
          },
        });
      } else {
        await prisma?.user.update({
          where: {
            id: ctx.auth.id,
          },
          data: {
            SavedPosts: [...user.SavedPosts, input.postId],
          },
        });
      }

      return {
        success: true,
      };
    }),
  getUser: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.auth?.id) {
      throw new TRPCError({
        message: "You must be logged in to get user data.",
        code: "UNAUTHORIZED",
      });
    }

    return await prisma?.user.findUnique({
      where: {
        id: ctx.auth.id,
      },
    });
  }),
  getSavedPosts: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.auth?.id) {
        throw new TRPCError({
          message: "You must be logged in to get saved posts.",
          code: "UNAUTHORIZED",
        });
      }

      const user = await prisma?.user.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!user) {
        throw new TRPCError({
          message: "User not found.",
          code: "NOT_FOUND",
        });
      }

      return await prisma?.post.findMany({
        where: {
          id: {
            in: user.SavedPosts,
          },
        },
        include: { Subreddit: true, Votes: true, Comments: true },
      });
    }),
});

export type AppRouter = typeof appRouter;
