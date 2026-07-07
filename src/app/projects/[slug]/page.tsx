import { ThemeToggle } from "@/components/theme-toggle";
import { CommandMenu } from "@/components/command-menu";
import { TransitionLink } from "@/components/TransitionLink";
import { TopBanner } from "@/components/TopBanner";
import { RightNavbar } from "@/components/RightNavbar";
import { projectsData, iconMap, techNames, TechItem, TechKey } from "@/data/projectsData";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ExternalLink, ArrowLeft, Home } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { InteractivePreview } from "@/components/InteractivePreview";
import { CursorParticles } from "@/components/CursorParticles";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export async function generateStaticParams() {
  return projectsData.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projectsData.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <CursorParticles />
      <div className="min-h-screen w-full bg-white dark:bg-black relative overflow-x-hidden transition-colors duration-300">
        {/* Right Side Blueprint Navigation */}
      <RightNavbar />

      {/* Vertical Lines - Ultra-fine Micro Dots */}
      <div className="absolute top-0 bottom-0 left-[26%] w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none hidden md:block" style={{ maskImage: 'repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)' }} />
      <div className="absolute top-0 bottom-0 right-[26%] w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none hidden md:block" style={{ maskImage: 'repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)' }} />

      {/* Horizontal Lines - Ultra-fine Micro Dots */}
      <div className="absolute left-0 right-0 top-[22vh] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none" style={{ maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' }} />
      <div className="absolute left-0 right-0 top-[calc(22vh+112px)] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none" style={{ maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' }} />

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
              href="/projects"
              direction="left"
              className="group flex shrink-0 items-center justify-center w-8 h-8 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all hover:bg-zinc-200 dark:hover:bg-zinc-800"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            </TransitionLink>
            <div className="flex flex-col justify-center min-w-0">
              <h1 className="text-[18px] sm:text-[24px] font-bold text-zinc-800 dark:text-zinc-100 tracking-tight leading-tight sm:leading-none mb-0.5 [text-shadow:-1.5px_0_0_rgba(0,200,255,0.3),1.5px_0_0_rgba(255,80,0,0.3)] dark:[text-shadow:-1.5px_0_0_rgba(0,200,255,0.6),1.5px_0_0_rgba(255,80,0,0.6)] truncate">
                <span className={project.mobileTitle ? "hidden sm:inline" : ""}>
                  {project.title}
                </span>
                {project.mobileTitle && (
                  <span className="sm:hidden">
                    {project.mobileTitle}
                  </span>
                )}
              </h1>
              <div className="truncate">
                <Breadcrumbs
                  listClassName="flex-nowrap"
                  truncate={true}
                  maxItems={3}
                  items={[
                    { label: "Home", href: "/", icon: <Home className="w-3.5 h-3.5" /> },
                    { label: "Projects", href: "/projects" },
                    { label: project.mobileTitle ? (
                        <>
                          <span className="hidden sm:inline">{project.title}</span>
                          <span className="sm:hidden">{project.mobileTitle}</span>
                        </>
                      ) : (
                        project.title
                      ) 
                    },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Right: Controls */}
          <div className="absolute top-4 right-4 sm:static sm:top-auto sm:right-auto flex items-center justify-end gap-2 sm:gap-3 shrink-0">
            <CommandMenu />
            <ThemeToggle className="dark:text-zinc-400 hover:dark:text-zinc-300" />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="ml-0 mr-0 md:ml-[26%] md:mr-[26%] pt-[calc(22vh+112px)] pb-16 px-4 flex flex-col z-10 relative">

        {/* Media (Video or Image) right at the top */}
        <div className="w-full aspect-video relative mt-8 rounded-lg overflow-hidden border border-black/10 dark:border-white/[0.15] shadow-sm bg-black z-20">
          {project.video ? (
            project.video.includes('youtube') ? (
              <iframe
                src={project.video}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <video 
                src={project.video} 
                className="w-full h-full object-cover" 
                controls 
                autoPlay 
                muted 
                loop 
                playsInline 
              />
            )
          ) : project.live && project.live !== "#" ? (
            <InteractivePreview 
              liveUrl={project.live} 
              imageSrc={project.src} 
              imageAlt={project.imageTitle} 
            />
          ) : (
            <Image 
              src={project.src} 
              alt={project.imageTitle} 
              fill 
              preload
              sizes="(min-width: 768px) 40vw, 100vw"
              quality={75}
              className="object-cover"
            />
          )}
        </div>

        {/* Top Dashed Divider (Blueprint system) */}
        <div className="relative mt-8">
          <div className="absolute left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none" style={{ maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' }} />
          <div className="absolute left-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-[-1px] pointer-events-none z-20" />
          <div className="absolute right-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-[-1px] pointer-events-none z-20" />
        </div>

        {/* Action Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 items-center justify-between py-4 relative">
          {project.github ? (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-[13px] font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              <SiGithub className="w-4 h-4" /> Github
            </a>
          ) : <div />}
          
          {/* Vertical Divider 1 */}
          <div className="hidden md:block absolute left-1/3 top-0 bottom-0 w-0 border-l border-black/30 dark:border-white/[0.15] pointer-events-none" style={{ maskImage: 'repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)' }} />

          {project.live ? (
            <a href={project.live} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-[13px] font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              <ExternalLink className="w-4 h-4" /> Website
            </a>
          ) : <div />}
          
          {/* Vertical Divider 2 */}
          <div className="hidden md:block absolute left-2/3 top-0 bottom-0 w-0 border-l border-black/30 dark:border-white/[0.15] pointer-events-none" style={{ maskImage: 'repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)' }} />

          {/* Horizontal Divider for Mobile Only */}
          <div className="col-span-2 md:hidden relative my-2">
            <div className="absolute left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none" style={{ maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' }} />
            <div className="absolute left-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-[-1px] pointer-events-none z-20" />
            <div className="absolute right-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-[-1px] pointer-events-none z-20" />
          </div>

          {project.slug === 'sti-elms' ? (
            <div className="col-span-2 md:col-span-1 flex items-center justify-center gap-2 text-[13px] font-medium text-rose-500/80 cursor-not-allowed mt-4 md:mt-0" title="Confidential - School Project">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Confidential
            </div>
          ) : (
            <TransitionLink href={`/projects/${project.slug}/how-its-made`} direction="right" className="col-span-2 md:col-span-1 flex items-center justify-center gap-2 text-[13px] font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mt-4 md:mt-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
              How it's made
            </TransitionLink>
          )}
        </div>

        {/* Bottom Dashed Divider */}
        <div className="relative mb-6">
          <div className="absolute left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none" style={{ maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' }} />
          <div className="absolute left-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-[-1px] pointer-events-none z-20" />
          <div className="absolute right-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-[-1px] pointer-events-none z-20" />
        </div>

        {/* Title and Status */}
        <div className="flex items-center justify-between w-full mb-4">
          <h1 className="text-[24px] sm:text-[28px] font-bold text-zinc-900 dark:text-zinc-50 tracking-tight leading-none">
            {project.title}
          </h1>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[13px] font-medium text-emerald-600 dark:text-emerald-400">Live</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-[14px] sm:text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
          {project.description}
        </p>

        {/* Dashed Divider before Stack */}
        <div className="relative mt-8 mb-6">
          <div className="absolute left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none" style={{ maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' }} />
          <div className="absolute left-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-[-1px] pointer-events-none z-20" />
          <div className="absolute right-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-[-1px] pointer-events-none z-20" />
        </div>

        {/* Tech Stack */}
        <div>
          <h2 className="text-[16px] font-bold text-zinc-900 dark:text-zinc-50 tracking-tight mb-4">Stack used</h2>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {project.tech.map((t: TechItem, i: number) => {
              const isKey = typeof t === "string";
              const label = isKey ? techNames[t as TechKey] : t.label;
              const Icon = isKey ? iconMap[t as TechKey] : null;

              return (
                <div key={i} className="flex shrink-0 whitespace-nowrap items-center gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/5 rounded-md text-[11px] sm:text-[12px] font-medium text-zinc-700 dark:text-zinc-300">
                  {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
                  <span>{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
