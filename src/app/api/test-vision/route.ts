import { generateText } from 'ai';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

const openzen = createOpenAICompatible({
  name: 'opencode',
  baseURL: process.env.OPENZEN_BASE_URL || 'https://opencode.ai/zen/v1',
  headers: {
    Authorization: `Bearer ${process.env.OPENZEN_API_KEY}`,
  }
});

export async function POST(req: Request) {
  try {
    const largeBase64 = "data:image/png;base64," + "A".repeat(1.5 * 1024 * 1024);
    const result = await generateText({
      model: openzen('mimo-v2.5-free'),
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'What is this?' },
            { type: 'image', image: largeBase64 }
          ]
        }
      ]
    });
    return new Response(JSON.stringify({ success: true, text: result.text }));
  } catch (err: any) {
    const errorData = {
      message: err.message,
      name: err.name,
      cause: err.cause,
      response: err.response,
      raw: err.toJSON ? err.toJSON() : err
    };
    return new Response(JSON.stringify({ success: false, error: errorData }));
  }
}
