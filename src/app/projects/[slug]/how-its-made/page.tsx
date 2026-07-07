// Force Turbopack rebuild to clear stale SSR cache
import { projectsData } from "@/data/projectsData";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BrainCircuit, Terminal, ShieldCheck, Layers, MousePointerClick, Trash2, Zap, Scissors, Cpu, Database, Battery, CircleDashed, Home } from "lucide-react";
import { RightNavbar } from "@/components/RightNavbar";
import { CursorParticles } from "@/components/CursorParticles";
import { ThemeToggle } from "@/components/theme-toggle";
import { CommandMenu } from "@/components/command-menu";
import { TransitionLink } from "@/components/TransitionLink";
import { TopBanner } from "@/components/TopBanner";
import { NumberTicker } from "@/components/ui/number-ticker";
import { AnimatedRoadmap } from "@/components/AnimatedRoadmap";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { AsciiText } from "@/components/ui/ascii-text";
import { MetricCards } from "@/components/MetricCards";
import { TechStackCards, CardSwirlBackground } from "@/components/TechStackCards";
import { HardwareCheckCards } from "@/components/HardwareCheckCards";
import { PerformanceCards } from "@/components/PerformanceCards";
import { FigmaVideoWrapper } from "@/components/FigmaVideoWrapper";

export default async function HowItsMadePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projectsData.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <CursorParticles />
      <div className="min-h-screen w-full bg-white dark:bg-black relative overflow-x-hidden transition-colors duration-300">
        <RightNavbar />

        {/* Vertical Lines - Ultra-fine Micro Dots */}
        <div className="absolute top-0 bottom-0 left-[26%] w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none hidden md:block" style={{ maskImage: 'repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)' }} />
        <div className="absolute top-0 bottom-0 right-[26%] w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none hidden md:block" style={{ maskImage: 'repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)' }} />

        {/* Ultra-Tiny Solid Nodes */}
        {[
          { top: '22vh', left: '26%' },
          { top: '22vh', right: '26%' },
          { top: 'calc(22vh + 112px)', left: '26%' },
          { top: 'calc(22vh + 112px)', right: '26%' },
        ].map((pos, i) => (
          <div key={i} className="absolute w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] pointer-events-none z-10 hidden md:block"
            style={{
              top: pos.top,
              left: pos.left,
              right: pos.right,
              transform: `translate(${pos.right ? '50%' : '-50%'}, -50%)`
            }} />
        ))}

        {/* Cell 1: Top Banner */}
        <TopBanner />

        {/* Cell 2: Header with Back Button + Title + Controls */}
        <div className="absolute left-0 right-0 md:left-[26%] md:right-[26%] top-[22vh] h-[112px] flex items-center px-4 z-50">
          <div className="flex w-full items-center justify-between">
            {/* Left: Back + Title */}
            <div className="flex items-center gap-3 sm:gap-5 min-w-0 pr-2">
              <TransitionLink
                href={`/projects/${slug}`}
                direction="left"
                className="shrink-0 group flex items-center justify-center w-8 h-8 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all hover:bg-zinc-200 dark:hover:bg-zinc-800"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              </TransitionLink>
              <div className="flex flex-col justify-center min-w-0">
                <h1 className="text-[20px] sm:text-[24px] font-bold text-zinc-800 dark:text-zinc-100 tracking-tight leading-none mb-1 [text-shadow:-1.5px_0_0_rgba(0,200,255,0.3),1.5px_0_0_rgba(255,80,0,0.3)] dark:[text-shadow:-1.5px_0_0_rgba(0,200,255,0.6),1.5px_0_0_rgba(255,80,0,0.6)] truncate">
                  How it's made
                </h1>
                <div className="truncate">
                  <Breadcrumbs
                    listClassName="flex-nowrap"
                    truncate={true}
                    maxItems={4}
                    items={[
                      { label: "Home", href: "/", icon: <Home className="w-3.5 h-3.5" /> },
                      { label: "Projects", href: "/projects" },
                      { 
                        label: project.mobileTitle ? (
                          <>
                            <span className="hidden sm:inline">{project.title}</span>
                            <span className="sm:hidden">{project.mobileTitle}</span>
                          </>
                        ) : (
                          project.title
                        ), 
                        href: `/projects/${slug}` 
                      },
                      { label: "How it's made" },
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* Right: Controls */}
            <div className="flex items-start justify-end gap-2 sm:gap-3 h-24 py-1 shrink-0">
              <CommandMenu />
              <ThemeToggle className="dark:text-zinc-400 hover:dark:text-zinc-300" />
            </div>
          </div>
        </div>

        {/* Horizontal Lines */}
        <div className="absolute left-0 right-0 top-[22vh] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none" style={{ maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' }} />

        <div className="ml-0 mr-0 md:ml-[26%] md:mr-[26%] pt-[calc(22vh+112px)] pb-16 px-4 flex flex-col z-10 relative">
          <div className="w-full max-w-3xl mx-auto text-zinc-800 dark:text-zinc-300 space-y-12 leading-relaxed mt-16">
            
            {slug === 'prima-digital-agency' ? (
              <>
                <section id="part-1" className="scroll-mt-[22vh]">
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
                    <span className="w-8 h-[1px] bg-zinc-300 dark:bg-zinc-700"></span>
                    <AsciiText text="Part 1: The Genesis, The Teacher, and The Pivot" delay={0} />
                  </h2>
                  <p className="mb-4">
                    <strong>PRIMA</strong> started as my very first foundational project, a basic HTML and CSS site designed merely to grasp the fundamentals of how websites work. 
                  </p>
                  <p className="mb-4">
                    But as I entered my second year as an IT student, the project took on a completely new meaning. PRIMA isn't just a fictional sandbox; it is a real, growing digital agency founded by an industry mentor. I decided to take the initiative and build this premium landing page to help elevate their professional portfolio. This collaboration evolved into my first true B2B (Business-to-Business) project, establishing a professional partnership where I am trusted to develop full-stack applications for the agency's future clients.
                  </p>
                  <p className="mb-6">
                    With only about two years of coding fundamentals and a lot of "vibe coding" (relying on intuition, AI assistance, and rapid prototyping), I dove into a rigorous development sprint. Through a lot of trial, error, and late nights, I managed to re-architect the platform from the ground up, evolving it from a basic static HTML folder into a massive, production-ready web application.
                  </p>
                  
                  {/* Metric Cards */}
                  <MetricCards />
                </section>

                <section id="part-2" className="scroll-mt-[22vh]">
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
                    <span className="w-8 h-[1px] bg-zinc-300 dark:bg-zinc-700"></span>
                    <AsciiText text="Part 2: The Core Tech Stack & The Turbopack Advantage" delay={0} />
                  </h2>
                  <p className="mb-6">I wanted the platform to make an aggressive, powerful first impression, but I knew I had to use modern frameworks to pull it off.</p>
                  <TechStackCards />
                </section>

                <section id="part-3" className="scroll-mt-[22vh]">
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
                    <span className="w-8 h-[1px] bg-zinc-300 dark:bg-zinc-700"></span>
                    <AsciiText text="Part 3: The &quot;Ask AI Helper&quot; — My Biggest Learning Curve" delay={0} />
                  </h2>
                  <p className="mb-6">One of the most complex features I tackled was an embedded AI chat interface utilizing the Google Gemini SDK. I honestly didn't know if I could pull it off, but the core prompt interface code alone eventually grew into a massive <strong>2,100+ lines of logic</strong>.</p>
                  
                  <div className="mb-8 w-full">
                    <FigmaVideoWrapper>
                      <div className="w-full aspect-video rounded-xl overflow-hidden border border-black/10 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] bg-zinc-100 dark:bg-zinc-900">
                        <video src="/Video's/PRIMA Documentary Videos/The AI Chatbot Streaming.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover"></video>
                      </div>
                    </FigmaVideoWrapper>
                  </div>

                  <ul className="space-y-6 mt-6">
                    <li className="flex gap-3 items-start">
                      <BrainCircuit className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-1 flex-shrink-0" />
                      <div>
                        <strong className="text-zinc-900 dark:text-zinc-100 block mb-1 text-[16px]">
                          <AsciiText text="State Management" delay={0} />
                        </strong>
                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[15px]">
                          I learned how to build a state-machine that manages visual &quot;reasoning&quot; and &quot;thinking&quot; states, giving the user real-time feedback.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3 items-start">
                      <Terminal className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-1 flex-shrink-0" />
                      <div>
                        <strong className="text-zinc-900 dark:text-zinc-100 block mb-1 text-[16px]">
                          <AsciiText text="Real-Time Streaming & Markdown" delay={200} />
                        </strong>
                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[15px]">
                          Getting the chatbox to handle real-time token streaming natively was a massive challenge. I integrated a Markdown renderer that formats code blocks and bold text instantly as the AI &quot;speaks.&quot;
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3 items-start">
                      <ShieldCheck className="w-5 h-5 text-rose-600 dark:text-rose-400 mt-1 flex-shrink-0" />
                      <div>
                        <strong className="text-zinc-900 dark:text-zinc-100 block mb-1 text-[16px]">
                          <AsciiText text="Input Queuing & Spam Protection" delay={400} />
                        </strong>
                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[15px]">
                          During testing, I realized users could spam the &quot;send&quot; button and break the API. To fix this, I engineered a strict input queuing system that disables the input field and shows a loading state while the AI processes.
                        </p>
                      </div>
                    </li>
                  </ul>
                </section>

                <section id="part-4" className="scroll-mt-[22vh]">
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
                    <span className="w-8 h-[1px] bg-zinc-300 dark:bg-zinc-700"></span>
                    <AsciiText text="Part 4: Visual Excellence and Shaders" delay={0} />
                  </h2>
                  <p className="mb-6">Beyond standard React, I wanted to experiment with graphical limits. I integrated <code>Three.js</code> and <code>@paper-design/shaders</code> to render true 3D visual elements that respond to the user's cursor.</p>
                  <div className="flex flex-col gap-4">
                    <div className="p-5 rounded-lg border border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors relative overflow-hidden group">
                      <CardSwirlBackground className="absolute -top-32 -left-32 w-[600px] h-[600px]" word=" " />
                      <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center pointer-events-none w-full">
                        <div className="flex-1 flex flex-col items-start text-left">
                          <div className="w-10 h-10 rounded-full bg-cyan-500/10 dark:bg-cyan-500/20 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 dark:group-hover:bg-cyan-500/30 transition-colors">
                            <Layers className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                          </div>
                          <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Dynamic Layouts</h4>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-0">
                            Using Framer Motion's `layout` tags, I learned how to make containers behave like liquid. For example, the Hero section swapping between the words "brand," "business," and "future" dynamically snaps its container bounds to the exact width of the changing text in real-time.
                          </p>
                        </div>
                        <div className="relative w-full md:w-1/2 aspect-[4/3] rounded-md overflow-hidden bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 shadow-sm shrink-0">
                          <video src="/Video's/PRIMA Documentary Videos/Dynamic Layout Video.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover"></video>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 rounded-lg border border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors relative overflow-hidden group">
                      <CardSwirlBackground className="absolute -top-32 -right-32 w-[600px] h-[600px]" word=" " />
                      <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center pointer-events-none w-full">
                        <div className="relative w-full md:w-1/2 aspect-[4/3] rounded-md overflow-hidden bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 shadow-sm shrink-0">
                          <video src="/Video's/PRIMA Documentary Videos/Modal.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover"></video>
                        </div>
                        <div className="flex-1 flex flex-col items-start text-left">
                          <div className="w-10 h-10 rounded-full bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center mb-4 group-hover:bg-amber-500/20 dark:group-hover:bg-amber-500/30 transition-colors">
                            <MousePointerClick className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                          </div>
                          <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Interactive Funnels</h4>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-0">
                            I built a custom step-by-step booking modal that handles user inputs while locking the background page scrolling on both desktop and mobile devices.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section id="part-5" className="scroll-mt-[22vh]">
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
                    <span className="w-8 h-[1px] bg-zinc-300 dark:bg-zinc-700"></span>
                    <AsciiText text="Part 5: The Brutal Reality of Mobile Performance" delay={0} />
                  </h2>
                  <p className="mb-4">
                    While the site ran flawlessly on my computer and high-end devices, my beta testing across various screen sizes revealed a harsh reality check: on lower-end and older mid-range Android devices, the site suffered from severe rendering lag. 
                  </p>
                  <p className="mb-4">
                    Through researching performance bottlenecks, I learned that overlapping CSS <code>blur</code> filters and layout animations were destroying the GPU limits of budget phones. 
                  </p>
                  <PerformanceCards />
                  <p>This optimization ensured that even older Android devices could render the highly interactive UI without lagging.</p>
                </section>

                <section id="part-6" className="scroll-mt-[22vh]">
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
                    <span className="w-8 h-[1px] bg-zinc-300 dark:bg-zinc-700"></span>
                    <AsciiText text="Part 6: Global Hardware-Aware Progressive Degradation" delay={0} />
                  </h2>
                  <p className="mb-4">
                    I wanted to make sure the site wouldn't crash on even weaker phones. I researched native browser APIs and wrote a custom React hook that acts as a global safety net.
                  </p>
                  <p className="mb-4">
                    The millisecond a user opens the page, this hook silently checks their hardware (<code>navigator.deviceMemory</code> and <code>navigator.hardwareConcurrency</code>). 
                  </p>
                  <HardwareCheckCards />
                  <p>
                    ...It automatically overrides the entire application, gracefully disabling all heavy Framer Motion physics and instantly snapping elements to their final states to save battery and CPU cycles.
                  </p>
                </section>

                <section id="part-7" className="scroll-mt-[22vh]">
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
                    <span className="w-8 h-[1px] bg-zinc-300 dark:bg-zinc-700"></span>
                    <AsciiText text="Part 7: The Future Roadmap & Brutal Honesty" delay={0} />
                  </h2>
                  <p className="mb-6">
                    While designing and coding a 21,000-line Next.js platform in 4 days is an incredible personal milestone for a 2nd-year student, I know that true enterprise software is never truly "done." The current architecture is a highly polished front-end, but to scale this into a fully finished, deployed product, my roadmap includes:
                  </p>
                  <AnimatedRoadmap />
                  <p className="italic text-zinc-500 dark:text-zinc-400">
                    This project pushed my fundamentals to the absolute limit, but it ultimately serves as the foundation for my ongoing journey into full-stack development.
                  </p>
                </section>
              </>
            ) : (
                <div className="p-8 rounded-lg border border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col items-center justify-center min-h-[300px]">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">Document in Progress</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center max-w-md">
                    The technical documentation and architecture overview for {project.title} is currently being drafted.
                  </p>
                </div>
            )}
            
          </div>
        </div>
      </div>
    </>
  );
}
