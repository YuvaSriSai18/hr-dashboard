'use server';
/**
 * @fileOverview A flow to generate employee bios for HR managers to streamline onboarding.
 *
 * - generateEmployeeBio - A function that handles the generation of employee bios.
 * - GenerateEmployeeBioInput - The input type for the generateEmployeeBio function.
 * - GenerateEmployeeBioOutput - The return type for the generateEmployeeBio function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEmployeeBioInputSchema = z.object({
  fullName: z.string().describe('The full name of the employee.'),
  position: z.string().describe('The job title or position of the employee.'),
  department: z.string().describe('The department the employee belongs to.'),
  yearsOfExperience: z
    .number()
    .describe('The number of years of experience the employee has.'),
  skills: z.array(z.string()).describe('A list of skills the employee possesses.'),
});
export type GenerateEmployeeBioInput = z.infer<typeof GenerateEmployeeBioInputSchema>;

const GenerateEmployeeBioOutputSchema = z.object({
  bio: z.string().describe('A generated biography for the employee.'),
});
export type GenerateEmployeeBioOutput = z.infer<typeof GenerateEmployeeBioOutputSchema>;

export async function generateEmployeeBio(
  input: GenerateEmployeeBioInput
): Promise<GenerateEmployeeBioOutput> {
  return generateEmployeeBioFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEmployeeBioPrompt',
  input: {schema: GenerateEmployeeBioInputSchema},
  output: {schema: GenerateEmployeeBioOutputSchema},
  prompt: `You are an expert HR assistant tasked with creating engaging and professional employee biographies.

  Based on the information provided, craft a compelling biography that highlights the employee's key attributes and experience.

  Employee Name: {{fullName}}
  Position: {{position}}
  Department: {{department}}
  Years of Experience: {{yearsOfExperience}}
  Skills: {{#each skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Write a bio that is approximately 100-150 words. Focus on making the bio sound professional and highlight the value this person brings to the company.
  The bio should be written in a way that makes the employee sound like a valuable asset to the company.
  Do not include any salutations or sign-offs.
  Do not include any personal information outside of professional details.
  `,
});

const generateEmployeeBioFlow = ai.defineFlow(
  {
    name: 'generateEmployeeBioFlow',
    inputSchema: GenerateEmployeeBioInputSchema,
    outputSchema: GenerateEmployeeBioOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
