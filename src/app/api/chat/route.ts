import { streamText } from 'ai';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import fs from 'fs';

const openzen = createOpenAICompatible({
  name: 'opencode',
  baseURL: process.env.OPENZEN_BASE_URL || 'https://opencode.ai/zen/v1',
  headers: {
    Authorization: `Bearer ${process.env.OPENZEN_API_KEY}`,
  }
});

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, model = 'mimo-v2.5-free', effort = 'high' } = body;

    // Log the exact payload we received from useChat for debugging!
    // Log removed

    let reasoningInstruction = "";
    if (effort === "high") {
      reasoningInstruction = "CRITICAL INSTRUCTION: You MUST perform an extremely thorough, exhaustive, multi-step, deep chain of thought. Take a long time to explore all technical nuances, edge cases, user intent, and potential architectures before answering. Your reasoning should be extensive and detailed.";
    } else if (effort === "medium") {
      reasoningInstruction = "INSTRUCTION: Perform a standard, balanced reasoning process before answering. Think through the steps logically without being overly brief or unnecessarily exhaustive.";
    } else {
      reasoningInstruction = "INSTRUCTION: You MUST think very briefly and concisely. Provide a quick, direct reasoning without overthinking. Keep your chain of thought as short as possible.";
    }

    const coreMessages = messages.map((m: any) => {
      if (m.parts && Array.isArray(m.parts)) {
        const validParts = m.parts.filter((p: any) => 
          p.type === 'text' || p.type === 'file' || p.type === 'image' || p.type === 'tool-call'
        ).map((p: any) => {
          if (p.type === 'text') {
            return { type: 'text', text: p.text };
          }
          if (p.type === 'file' || p.type === 'image') {
            // Vercel AI SDK Core expects { type: 'image', image: ... }
            return { type: 'image', image: p.url || p.image };
          }
          return p;
        });
        
        return {
          role: m.role,
          content: validParts.length > 0 ? validParts : m.content || ""
        };
      }
      return m;
    });

    // Log the coreMessages payload
    // Log removed

    const result = await streamText({
      model: openzen(model),
      system: `You are an intelligent, professional AI assistant embedded into the portfolio of Josiah De Asis (a Full-Stack Front-End Engineer & UI Systems Architect). Your role is to answer questions about Josiah, his background, his projects, and modern front-end architecture, ensuring a premium visitor experience.

Here is the essential context about Josiah:
- **Bio**: First-year BS Information Technology student at STI College Meycauayan. He is an exceptionally passionate, self-taught engineer who focuses deeply on frontend systems, software architecture, and creating digital products that feel alive and highly polished.
- **Tech Stack**: Next.js, React, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS, Vite, Motion (Framer Motion), Supabase, PostgreSQL, Git, GitHub, Vercel, VS Code.
- **Key Projects**:
  - **PRIMA**: Evolved from his first site into a robust 21,000+ line web application. Serving as his ultimate testing ground for complex Motion animations, pixel-perfect layouts, custom component design, and responsive mobile performance optimization.
  - **STI eLMS Overhaul**: A modern, reimagined student learning management platform showing that education software can be fluid and beautiful. Integrates Row Level Security (RLS) and AES encryption for security.
- **Aesthetic & Engineering Mindset**: Josiah is obsessed with detail, smooth micro-animations, clean file structures, type safety, and optimal performance on all devices (mobile, tablet, desktop).

When answering:
- Keep your tone sharp, helpful, technically precise, and friendly.
- Do not make up facts. Focus on explaining Josiah's skills, projects, and learning journey.
- If asked about this portfolio's code, highlight that it's built with Next.js, React 19, Tailwind CSS, and Framer Motion.
- Be concise but complete. Format output beautifully using Markdown.
- CRITICAL: Do NOT use long dashes (em-dashes "—" or en-dashes "–"). ALWAYS use a single hyphen "-" or a comma instead to separate clauses.

${reasoningInstruction}`,
      messages: coreMessages,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: 'Failed to process request.', details: errorMessage }), { status: 500 });
  }
}
