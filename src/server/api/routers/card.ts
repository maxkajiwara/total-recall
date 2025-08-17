import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { getWebpageContent } from '~/lib/exa';

// Helper function to validate XOR logic for url/text
const validateUrlOrText = (url?: string | null, text?: string | null) => {
	const hasUrl = url && url.length > 0;
	const hasText = text && text.length > 0;

	if (!hasUrl && !hasText) {
		throw new TRPCError({
			code: 'BAD_REQUEST',
			message: "Either 'url' or 'text' must be provided",
		});
	}

	if (hasUrl && hasText) {
		throw new TRPCError({
			code: 'BAD_REQUEST',
			message: "Cannot provide both 'url' and 'text' - only one is allowed",
		});
	}
};

export const cardRouter = createTRPCRouter({
	create: publicProcedure
		.input(
			z.object({
				name: z.string().min(1),
				userContext: z.string().optional(),
				sources: z.array(
					z.object({
						url: z.string().url('Invalid URL format').optional(),
						text: z.string().min(1, 'Text cannot be empty').optional(),
					})
				),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const sources: { url?: string; text?: string; extractedContent?: string | null }[] = [];

			// If URL is provided, extract content using EXA
			if (input.sources.length > 0) {
				for (const source of input.sources) {
					validateUrlOrText(source.url, source.text);

					let extractedContent: string | null = null;

					if (source.url) {
						try {
							console.log('Extracting content for URL:', source.url);
							const exaResponse = await getWebpageContent(source.url);
							extractedContent = JSON.stringify(exaResponse);
							console.log(
								'Successfully extracted content, storing complete response as JSON'
							);
						} catch (error) {
							console.error('Failed to extract content from URL:', error);
							throw new TRPCError({
								code: 'INTERNAL_SERVER_ERROR',
								message: 'Failed to extract content from URL',
							});
						}
					}

					sources.push({
						url: source.url,
						text: source.text,
						extractedContent,
					});
				}
			}

			return ctx.db.card.create({
				data: {
					name: input.name,
					userContext: input.userContext,
					sources: {
						create: sources,
					},
				},
			});
		}),

	getLatest: publicProcedure.query(async ({ ctx }) => {
		const card = await ctx.db.card.findFirst({
			orderBy: { createdAt: 'desc' },
		});

		return card ?? null;
	}),
});
