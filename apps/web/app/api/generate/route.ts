import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { prompt } = await req.json();

  // Mock response for now if no key
  if (!process.env.OPENAI_API_KEY) {
    return new Response("La clé API OpenAI n'est pas configurée", { status: 500 });
  }

  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages: [
        { role: 'system', content: 'Tu es un assistant IA expert en édition de documents professionnels.' },
        { role: 'user', content: prompt }
    ],
  });

  return result.toDataStreamResponse();
}
