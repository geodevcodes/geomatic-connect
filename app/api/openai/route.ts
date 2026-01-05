import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { blogInitialMessage } from "@/lib/data";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
  compatibility: "strict", // strict mode, enable when using OpenAI API
});

// Set the run time for edge
export const runtime = "edge";

export async function POST(request: Request) {
  const { messages } = await request.json();
  const stream = await streamText({
    model: openai("gpt-4o-mini"),
    messages: [blogInitialMessage, ...messages],
    temperature: 1,
  });
  return stream.toDataStreamResponse();
}
