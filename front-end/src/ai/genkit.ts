import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

/**
 * AI configuration for LandLedger application
 * Uses Google's Gemini 2.0 Flash model for location suggestions
 * and other AI-powered features
 */
export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});
