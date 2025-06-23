// This is an AI-powered function that detects the number of baskets scored in a basketball game video.
// It takes a video as input and returns the number of baskets detected.
// - countBaskets - A function that handles the basket detection process.
// - CountBasketsInput - The input type for the countBaskets function.
// - CountBasketsOutput - The return type for the countBaskets function.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CountBasketsInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video of a basketball game, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type CountBasketsInput = z.infer<typeof CountBasketsInputSchema>;

const CountBasketsOutputSchema = z.object({
  numberOfBaskets: z.number().describe('The number of baskets detected in the video.'),
  feedback: z.string().describe('Feedback on the gameplay based on the number of baskets.'),
});
export type CountBasketsOutput = z.infer<typeof CountBasketsOutputSchema>;

export async function countBaskets(input: CountBasketsInput): Promise<CountBasketsOutput> {
  return countBasketsFlow(input);
}

const feedbackTool = ai.defineTool({
  name: 'provideFeedback',
  description: 'Provides feedback on the gameplay based on the number of baskets scored.',
  inputSchema: z.object({
    numberOfBaskets: z.number().describe('The number of baskets scored in the game.'),
  }),
  outputSchema: z.string(),
},
async (input) => {
  if (input.numberOfBaskets < 5) {
    return 'Needs improvement. Focus on shooting practice to increase the number of baskets.';
  } else if (input.numberOfBaskets < 10) {
    return 'Good effort. Consistent shooting practice will lead to better results.';
  } else {
    return 'Excellent performance! Keep up the great work to maintain high scoring efficiency.';
  }
});

const countBasketsPrompt = ai.definePrompt({
  name: 'countBasketsPrompt',
  tools: [feedbackTool],
  input: {schema: CountBasketsInputSchema},
  output: {schema: CountBasketsOutputSchema},
  prompt: `You are an AI that analyzes basketball game videos and counts the number of baskets scored.

  Analyze the following video and provide the number of baskets scored. You should also provide feedback on the gameplay using the feedbackTool.
  The feedback should be based on the number of baskets scored. Here is the video:
  {{media url=videoDataUri}}

  Make sure the number of baskets in the output is an integer.

  If you can't see any basketball actions or baskets, return 0 for the number of baskets.
  `,
});

const countBasketsFlow = ai.defineFlow(
  {
    name: 'countBasketsFlow',
    inputSchema: CountBasketsInputSchema,
    outputSchema: CountBasketsOutputSchema,
  },
  async input => {
    const {output} = await countBasketsPrompt(input);
    return output!;
  }
);
