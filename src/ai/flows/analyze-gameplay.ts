// src/ai/flows/analyze-gameplay.ts
'use server';
/**
 * @fileOverview Provides feedback on the gameplay based on the number of baskets.
 *
 * - analyzeGameplay - A function that analyzes the gameplay and provides feedback.
 * - AnalyzeGameplayInput - The input type for the analyzeGameplay function.
 * - AnalyzeGameplayOutput - The return type for the analyzeGameplay function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeGameplayInputSchema = z.object({
  numberOfBaskets: z
    .number()
    .describe('The number of baskets scored in the game.'),
});
export type AnalyzeGameplayInput = z.infer<typeof AnalyzeGameplayInputSchema>;

const AnalyzeGameplayOutputSchema = z.object({
  feedback: z.string().describe('The AI analysis and feedback on the game.'),
});
export type AnalyzeGameplayOutput = z.infer<typeof AnalyzeGameplayOutputSchema>;

export async function analyzeGameplay(input: AnalyzeGameplayInput): Promise<AnalyzeGameplayOutput> {
  return analyzeGameplayFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeGameplayPrompt',
  input: {schema: AnalyzeGameplayInputSchema},
  output: {schema: AnalyzeGameplayOutputSchema},
  prompt: `You are an expert basketball coach providing feedback on a game.

  Based on the number of baskets scored, provide an analysis of the game and suggest areas for improvement.

  Number of baskets: {{{numberOfBaskets}}}
  `,
});

const analyzeGameplayFlow = ai.defineFlow(
  {
    name: 'analyzeGameplayFlow',
    inputSchema: AnalyzeGameplayInputSchema,
    outputSchema: AnalyzeGameplayOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
