
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Important: Set the runtime to edge
export const runtime = "edge";

export async function POST(req: Request): Promise<Response> {
  const { prompt } = await req.json();

  const result = await streamText({
    model: openai("gpt-4-turbo"),
    messages: [
      {
        role: "system",
        content: `You are a helpful AI writing assistant embedded in a rich text editor.
        Your goal is to help the user write, edit, and improve their text.
        You can improve, summarize, expand, translate, or simplify text based on the user's request.
        Always reply in the language of the prompt or as requested.
        Output valid markdown.`,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return result.toDataStreamResponse();
}
