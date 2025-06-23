// This is an AI-powered function that detects the number of baskets scored in a basketball game video,
// analyzes gameplay, and provides commentary.
// - countBaskets - A function that handles the basket detection and analysis process.
// - CountBasketsInput - The input type for the countBaskets function.
// - CountBasketsOutput - The return type for the countBaskets function.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CountBasketsInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video of a basketball game, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});
export type CountBasketsInput = z.infer<typeof CountBasketsInputSchema>;

const CountBasketsOutputSchema = z.object({
  numberOfBaskets: z
    .number()
    .describe('The number of baskets detected in the video.'),
  analysis: z
    .object({
      strengths: z
        .string()
        .describe("The player's strengths based on the video."),
      weaknesses: z
        .string()
        .describe("The player's weaknesses based on the video."),
    })
    .describe('Analysis of the gameplay.'),
  commentary: z
    .string()
    .describe(
      'A play-by-play commentary of the game as if from a sports commentator.'
    ),
});
export type CountBasketsOutput = z.infer<typeof CountBasketsOutputSchema>;

export async function countBaskets(
  input: CountBasketsInput
): Promise<CountBasketsOutput> {
  return countBasketsFlow(input);
}

const countBasketsPrompt = ai.definePrompt({
  name: 'countBasketsPrompt',
  input: {schema: CountBasketsInputSchema},
  output: {schema: CountBasketsOutputSchema},
  prompt: `You are an AI that analyzes basketball game videos. Your task is to do three things:
1. Count the number of baskets scored.
2. Provide an analysis of the player's performance, highlighting their strengths and weaknesses.
3. Generate a play-by-play commentary as if you were a sports commentator watching the game.

Analyze the following video and provide the number of baskets scored, the analysis, and the commentary.

Here is the video:
{{media url=videoDataUri}}

Make sure the number of baskets in the output is an integer.

If you can't see any basketball actions or baskets, return 0 for the number of baskets and provide appropriate feedback in the analysis and commentary fields.
  `,
});

const countBasketsFlow = ai.defineFlow(
  {
    name: 'countBasketsFlow',
    inputSchema: CountBasketsInputSchema,
    outputSchema: CountBasketsOutputSchema,
  },
  async (input) => {
    const {output} = await countBasketsPrompt(input);
    return output!;
  }
);
