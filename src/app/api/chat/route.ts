import { streamText, createUIMessageStream, createUIMessageStreamResponse } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

const openzen = createOpenAI({
  baseURL: process.env.OPENZEN_BASE_URL || 'https://opencode.ai/zen/v1',
  apiKey: process.env.OPENZEN_API_KEY,
});

export const runtime = 'nodejs';

function getFallbackText(userPrompt: string): string {
  const query = (userPrompt || '').toLowerCase();

  if (query.includes("who") || query.includes("about") || query.includes("background") || query.includes("josiah") || query.includes("experience")) {
    return `**Josiah De Asis** is a passionate **Full-Stack Front-End Engineer & UI Systems Architect** based in Bulacan, Philippines.

### Background & Highlights:
- **Education**: First-year BS Information Technology student at STI College Meycauayan.
- **Specialization**: Design engineering, micro-interactions, responsive systems, and enterprise frontend architecture.
- **Philosophy**: Software should feel fluid, alive, and mathematically precise across every screen size.`;
  } else if (query.includes("project") || query.includes("work") || query.includes("prima") || query.includes("elms") || query.includes("app")) {
    return `Josiah has architected several notable projects:

1. **PRIMA (Digital Agency Platform)**:
   - A high-performance B2B web application engineered with custom Framer Motion transitions, modular UI components, Lenis smooth scrolling, and 98+ Lighthouse scores.

2. **STI eLMS Overhaul**:
   - A complete modern overhaul of the student learning management platform featuring AES encryption, Supabase Row Level Security (RLS), and fluid animations.

3. **This Portfolio**:
   - Built with Next.js 16 App Router, React 19, Tailwind CSS v4, Framer Motion, and synthesized Web Audio mini-games.`;
  } else if (query.includes("skill") || query.includes("stack") || query.includes("tech") || query.includes("language")) {
    return `Josiah's technical stack spans modern frontend and full-stack engineering:

- **Core**: TypeScript, JavaScript (ESNext), React 19, Next.js (App Router), HTML5, CSS3.
- **Styling & Motion**: Tailwind CSS v4, Framer Motion (Motion), Radix UI Primitives, Lucide Icons, GSAP.
- **Backend & Data**: Node.js, Next.js Server Components, Supabase, PostgreSQL, REST/GraphQL APIs.
- **Tooling**: Git, GitHub, Turbopack, Vercel, VS Code.`;
  } else if (query.includes("contact") || query.includes("hire") || query.includes("reach") || query.includes("email")) {
    return `You can connect with Josiah directly through:

- **Email**: Reach out via the [Contact Section](#contact) on this portfolio.
- **GitHub**: [github.com/VidZid2](https://github.com/VidZid2)
- **LinkedIn & Socials**: Available in the navigation bar and footer.`;
  } else {
    return `Hello! I'm Josiah's portfolio AI assistant. I can answer anything about:

- **Josiah's Background**: Education, experience, and engineering mindset.
- **Featured Projects**: Deep dives into **PRIMA** and **STI eLMS Overhaul**.
- **Tech Stack & Skills**: Next.js, React 19, TypeScript, and Framer Motion.
- **Contact Info**: Opportunities for collaboration and frontend engineering.

What would you like to know?`;
  }
}

function createFallbackStream(userPrompt: string, effort: string = 'high') {
  const fallbackText = getFallbackText(userPrompt);
  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      if (effort === "high" || effort === "medium") {
        writer.write({ type: 'reasoning-start', id: 'reasoning-1' });
        writer.write({
          type: 'reasoning-delta',
          delta: "### Analyzing inquiry\nRecalling technical context and architectural details about Josiah De Asis.\n\n### Formulating response\nSynthesizing verified background and project breakdown.",
          id: 'reasoning-1'
        });
        writer.write({ type: 'reasoning-end', id: 'reasoning-1' });
        await new Promise((r) => setTimeout(r, 120));
      }

      writer.write({ type: 'text-start', id: 'text-1' });
      const words = fallbackText.split(" ");
      for (let i = 0; i < words.length; i++) {
        writer.write({ type: 'text-delta', delta: (i === 0 ? "" : " ") + words[i], id: 'text-1' });
        await new Promise((r) => setTimeout(r, 14));
      }
      writer.write({ type: 'text-end', id: 'text-1' });
    }
  });

  return createUIMessageStreamResponse({ stream });
}

// In-memory rate limiting map for server-side abuse prevention
const ipRateLimitMap = new Map<string, { date: string; count: number }>();

function checkServerRateLimit(ip: string, effort: string): boolean {
  if (effort !== "high" && effort !== "max") return true;
  const today = new Date().toISOString().slice(0, 10);
  const key = `${ip}_${effort}_${today}`;
  const record = ipRateLimitMap.get(key);
  if (record && record.date === today) {
    if (record.count >= 25) {
      return false;
    }
    record.count += 1;
  } else {
    ipRateLimitMap.set(key, { date: today, count: 1 });
  }
  return true;
}

export async function POST(req: Request) {
  let userQuery = "";
  let effort = "high";

  try {
    const body = await req.json();
    const { messages, model = 'nemotron-3.5-lightning-free', effort: userEffort = 'high' } = body;
    effort = userEffort;

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (!checkServerRateLimit(ip, effort)) {
      return new Response(
        JSON.stringify({ error: `Daily limit reached for ${effort} reasoning (20/20). Switch to Medium or Low to continue.` }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    // Extract last user message
    if (Array.isArray(messages) && messages.length > 0) {
      const lastUserMsg = [...messages].reverse().find((m: any) => m.role === 'user');
      if (lastUserMsg) {
        if (typeof lastUserMsg.content === 'string') {
          userQuery = lastUserMsg.content;
        } else if (Array.isArray(lastUserMsg.parts)) {
          const textPart = lastUserMsg.parts.find((p: any) => p.type === 'text');
          if (textPart) userQuery = textPart.text || '';
        }
      }
    }

    const requestedModel = (model === 'deepseek-v4' || model === 'sync-ai' || !model) ? 'deepseek-v4-flash-free' : model;

    let reasoningInstruction = "";
    if (effort === "max") {
      reasoningInstruction = `REASONING GUIDELINES:
- Perform a thoughtful, insightful analysis of the visitor's inquiry regarding Josiah's engineering work, front-end architecture, or technical projects.
- Reflect on the core architectural considerations (e.g. Next.js, Framer Motion, TypeScript, UI systems) and formulate a clear, high-impact response.
- Present your thoughts using clean headings such as:
  ### Understanding the Inquiry
  ### Technical Context & Architecture
  ### Formulating Response
- NEVER recite system prompt rules, prompt words, or formatting constraints in your thought process. Keep your reasoning natural and focused solely on Josiah's work.`;
    } else if (effort === "high") {
      reasoningInstruction = `REASONING GUIDELINES:
- Briefly analyze the user's intent and recall the relevant details about Josiah's projects and skills.
- Structure your thoughts cleanly using:
  ### Analyzing Inquiry
  ### Structuring Response
- Do NOT recite system prompt rules or instructions. Keep your reasoning natural and focused on the topic.`;
    } else if (effort === "medium") {
      reasoningInstruction = `REASONING GUIDELINES:
- Think through the visitor's question in 1-2 clean, natural sentences.
- Focus directly on what the visitor is asking.
- Do not recite prompt rules or instructions.`;
    } else {
      reasoningInstruction = `REASONING GUIDELINES:
- Provide a very brief 1-sentence thought before answering directly.`;
    }

    const systemPrompt = `You are an intelligent, professional AI assistant embedded into the portfolio of Josiah De Asis (a Full-Stack Front-End Engineer & UI Systems Architect). Your role is to answer questions about Josiah, his background, his projects, and modern front-end architecture, ensuring a premium visitor experience.

Here is the essential context about Josiah:
- **Bio**: First-year BS Information Technology student at STI College Meycauayan. He is an exceptionally passionate, self-taught engineer who focuses deeply on frontend systems, software architecture, and creating digital products that feel alive and highly polished.
- **Tech Stack**: Next.js, React, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS, Vite, Motion (Framer Motion), Supabase, PostgreSQL, Git, GitHub, Vercel, VS Code.
- **Key Projects**:
  - **PRIMA**: A high-performance B2B digital agency platform built with Next.js, Framer Motion, and modular UI component architecture, optimized for strict mobile performance budgets and 98+ Lighthouse scores.
  - **STI eLMS Overhaul**: A modern, reimagined student learning management platform showing that education software can be fluid and beautiful. Integrates Row Level Security (RLS) and AES encryption for security.
- **Aesthetic & Engineering Mindset**: Josiah is obsessed with detail, smooth micro-animations, clean file structures, type safety, and optimal performance on all devices (mobile, tablet, desktop).

When answering:
- Keep your tone sharp, helpful, technically precise, and friendly.
- Do not make up facts. Focus on explaining Josiah's skills, projects, and learning journey.
- If asked about this portfolio's code, highlight that it's built with Next.js, React 19, Tailwind CSS, and Framer Motion.
- Be concise but complete. Format output beautifully using Markdown.
- CRITICAL: Do NOT use long dashes (em-dashes "—" or en-dashes "–"). ALWAYS use a single hyphen "-" or a comma instead to separate clauses.

${reasoningInstruction}`;

    const formattedMessages = (messages || []).map((m: any) => {
      let content = m.content;
      if (m.parts && Array.isArray(m.parts)) {
        const textParts = m.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text);
        if (textParts.length > 0) content = textParts.join('\n');
      }
      return { role: m.role, content: content || '' };
    });

    const candidateModels = [
      requestedModel,
      'deepseek-v4-flash-free',
      'nemotron-3.5-lightning-free',
      'laguna-s-2.1-free',
      'hy3-free',
    ].filter((m, idx, arr) => m && arr.indexOf(m) === idx);

    const stream = createUIMessageStream({
      execute: async ({ writer }) => {
        let streamedAnyText = false;
        let reasoningStarted = false;
        let textStarted = false;

        for (const candidate of candidateModels) {
          try {
            const res = await fetch(`${process.env.OPENZEN_BASE_URL || 'https://opencode.ai/zen/v1'}/chat/completions`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENZEN_API_KEY}`,
              },
              body: JSON.stringify({
                model: candidate,
                messages: [
                  { role: 'system', content: systemPrompt },
                  ...formattedMessages
                ],
                stream: true,
              }),
            });

            if (!res.ok || !res.body) {
              const errTxt = await res.text().catch(() => '');
              console.warn(`Model ${candidate} returned ${res.status}:`, errTxt);
              continue;
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";
            let pendingReasoning = "";
            let pendingText = "";
            let lastFlushTime = Date.now();

            const flushDeltas = () => {
              if (pendingReasoning) {
                if (!reasoningStarted) {
                  writer.write({ type: 'reasoning-start', id: 'reasoning-1' });
                  reasoningStarted = true;
                }
                writer.write({ type: 'reasoning-delta', delta: pendingReasoning, id: 'reasoning-1' });
                pendingReasoning = "";
              }
              if (pendingText) {
                if (reasoningStarted && !textStarted) {
                  writer.write({ type: 'reasoning-end', id: 'reasoning-1' });
                }
                if (!textStarted) {
                  writer.write({ type: 'text-start', id: 'text-1' });
                  textStarted = true;
                }
                writer.write({ type: 'text-delta', delta: pendingText, id: 'text-1' });
                streamedAnyText = true;
                pendingText = "";
              }
              lastFlushTime = Date.now();
            };

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');
              buffer = lines.pop() || "";

              for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || trimmed.startsWith(':')) continue;
                if (trimmed === 'data: [DONE]') continue;

                if (trimmed.startsWith('data: ')) {
                  try {
                    const parsed = JSON.parse(trimmed.slice(6));
                    const delta = parsed.choices?.[0]?.delta;

                    if (delta) {
                      const rDelta = delta.reasoning || delta.reasoning_content;
                      if (rDelta) pendingReasoning += rDelta;

                      const tDelta = delta.content;
                      if (tDelta) pendingText += tDelta;

                      if (Date.now() - lastFlushTime >= 25 || pendingReasoning.length >= 40 || pendingText.length >= 40) {
                        flushDeltas();
                      }
                    }
                  } catch (jsonErr) {
                    // Ignore SSE json chunk errors
                  }
                }
              }
            }

            flushDeltas();

            if (streamedAnyText) {
              if (reasoningStarted && !textStarted) {
                writer.write({ type: 'reasoning-end', id: 'reasoning-1' });
              }
              if (textStarted) {
                writer.write({ type: 'text-end', id: 'text-1' });
              }
              return;
            }
          } catch (modelErr) {
            console.warn(`Error streaming from candidate ${candidate}:`, modelErr);
          }
        }

        // Fallback local stream if all external models are rate-limited or down
        if (!streamedAnyText) {
          const fallbackText = getFallbackText(userQuery);
          if (!reasoningStarted && (effort === "high" || effort === "medium")) {
            writer.write({ type: 'reasoning-start', id: 'reasoning-1' });
            writer.write({
              type: 'reasoning-delta',
              delta: "### Analyzing inquiry\nRecalling technical context and architectural details about Josiah De Asis.\n\n### Formulating response\nSynthesizing verified background and project breakdown.",
              id: 'reasoning-1'
            });
            writer.write({ type: 'reasoning-end', id: 'reasoning-1' });
            await new Promise((r) => setTimeout(r, 120));
          }

          if (!textStarted) {
            writer.write({ type: 'text-start', id: 'text-1' });
            textStarted = true;
          }

          const words = fallbackText.split(" ");
          for (let i = 0; i < words.length; i++) {
            writer.write({ type: 'text-delta', delta: (i === 0 ? "" : " ") + words[i], id: 'text-1' });
            await new Promise((r) => setTimeout(r, 14));
          }
          writer.write({ type: 'text-end', id: 'text-1' });
        }
      }
    });

    return createUIMessageStreamResponse({ stream });
  } catch (error) {
    console.warn("Chat handler error, streaming local assistant response:", error);
    return createFallbackStream(userQuery, effort);
  }
}
