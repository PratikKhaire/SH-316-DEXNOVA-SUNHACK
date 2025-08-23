// src/ai/flows/suggest-location.ts
'use server';
/**
 * @fileOverview A flow for suggesting GPS coordinates based on a text description.
 *
 * - suggestLocation - A function that suggests GPS coordinates based on a text description.
 * - SuggestLocationInput - The input type for the suggestLocation function.
 * - SuggestLocationOutput - The return type for the suggestLocation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestLocationInputSchema = z.object({
  locationDescription: z
    .string()
    .describe('A text description of the desired location (e.g., \'near downtown\', \'close to the river\').'),
});
export type SuggestLocationInput = z.infer<typeof SuggestLocationInputSchema>;

const SuggestLocationOutputSchema = z.object({
  gpsCoordinates: z
    .string()
    .describe('AI-generated suggestions for precise GPS coordinates based on the location description.'),
});
export type SuggestLocationOutput = z.infer<typeof SuggestLocationOutputSchema>;

export async function suggestLocation(input: SuggestLocationInput): Promise<SuggestLocationOutput> {
  return suggestLocationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestLocationPrompt',
  input: {schema: SuggestLocationInputSchema},
  output: {schema: SuggestLocationOutputSchema},
  prompt: `You are a helpful AI assistant that suggests GPS coordinates based on a text description of a desired location.

  The user will provide a text description of a desired location, and you should respond with suggested GPS coordinates.

  For example, if the user provides the description \'near downtown\', you might respond with \'34.0522,-118.2437\' (Los Angeles downtown).

  Description: {{{locationDescription}}}
  `,
});

const suggestLocationFlow = ai.defineFlow(
  {
    name: 'suggestLocationFlow',
    inputSchema: SuggestLocationInputSchema,
    outputSchema: SuggestLocationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
