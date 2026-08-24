import { ThemeToggle } from "@/components/theme-toggle";
import { CommandMenu } from "@/components/command-menu";
import { TransitionLink } from "@/components/TransitionLink";
import { BlueprintGrid } from "@/components/BlueprintGrid";
import { projectsData, iconMap, techNames, TechItem, TechKey } from "@/data/projectsData";
import { notFound } from "next/navigation";
import { ExternalLink, ArrowLeft, Home } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { InteractivePreview } from "@/components/InteractivePreview";
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
    <BlueprintGrid
      headerSlot={
        <div className="absolute left-3 right-3 sm:left-4 sm:right-4 md:left-[24.5%] md:right-[24.5%] top-[22vh] h-[112px] flex items-center px-2 sm:px-4 z-50">
          <div className="flex w-full items-center justify-between">
            {/* Left: Back + Title */}
            <div className="flex items-center gap-3 sm:gap-5 min-w-0 pr-2">
              <TransitionLink
                href="/projects"
                direction="left"
                className="group flex shrink-0 items-center justify-center w-8 h-8 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all hover:bg-zinc-200 dark:hover:bg-zinc-800"
                aria-label="Back to projects"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              </TransitionLink>
              <div className="flex flex-col justify-center min-w-0">
                <h1 className="text-[18px] sm:text-[24px] font-bold text-zinc-800 dark:text-zinc-100 tracking-tight leading-tight sm:leading-none mb-0.5 [text-shadow:-1.5px_0_0_rgba(0,200,255,0.15),1.5px_0_0_rgba(255,80,0,0.15)] dark:[text-shadow:-1.5px_0_0_rgba(0,200,255,0.25),1.5px_0_0_rgba(255,80,0,0.25)] truncate">
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
                      { label: project.title },
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* Top-right absolute buttons container */}
            <div className="absolute top-1.5 right-2 sm:top-3 sm:right-4 flex items-center gap-1.5 sm:gap-3 pointer-events-auto z-20">
              <ThemeToggle className="dark:text-zinc-400 hover:dark:text-zinc-300 shrink-0" />
              <CommandMenu />
            </div>
          </div>
        </div>
      }
    >
      {/* Content Section */}
      <div className="ml-3 mr-3 sm:ml-4 sm:mr-4 md:ml-[24.5%] md:mr-[24.5%] md:mx-0 pt-[calc(22vh+112px)] pb-16 px-3 sm:px-4 flex flex-col z-10 relative">
        {/* Project Interactive Preview Banner */}
        <div className="w-full aspect-[16/10] sm:aspect-[16/9] relative rounded-xl overflow-hidden shadow-2xl border border-black/10 dark:border-white/10 mt-6">
          <InteractivePreview
            liveUrl={project.live}
            imageSrc={project.src}
            imageAlt={project.title}
          />
        </div>

        {/* Top Dashed Divider before Action Links */}
        <div className="relative mt-8">
          <div
            className="absolute left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
            style={{
              maskImage:
                "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
              WebkitMaskImage:
                "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
            }}
          />
          <div className="absolute -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-[-1px] pointer-events-none z-20" />
          <div className="absolute -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-[-1px] pointer-events-none z-20" />
        </div>

        {/* Action Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 items-center justify-between py-4 relative">
          {project.github && project.github !== "#" ? (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-[13px] font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              <SiGithub className="w-4 h-4" aria-hidden="true" /> Github
            </a>
          ) : (
            <div className="flex items-center justify-center gap-2 text-[13px] font-medium text-zinc-400 dark:text-zinc-600 cursor-not-allowed">
              <SiGithub className="w-4 h-4" aria-hidden="true" /> Github
            </div>
          )}

          {/* Vertical Divider 1 */}
          <div
            className="hidden md:block absolute left-1/3 top-0 bottom-0 w-0 border-l border-black/30 dark:border-white/[0.15] pointer-events-none"
            style={{
              maskImage:
                "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
              WebkitMaskImage:
                "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
            }}
          />

          {project.live && project.live !== "#" ? (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-[13px] font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> Website
            </a>
          ) : (
            <div />
          )}

          {/* Vertical Divider 2 */}
          <div
            className="hidden md:block absolute left-2/3 top-0 bottom-0 w-0 border-l border-black/30 dark:border-white/[0.15] pointer-events-none"
            style={{
              maskImage:
                "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
              WebkitMaskImage:
                "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
            }}
          />

          {/* Horizontal Divider for Mobile Only */}
          <div className="col-span-2 md:hidden relative my-2">
            <div
              className="absolute left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
              style={{
                maskImage:
                  "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
                WebkitMaskImage:
                  "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
              }}
            />
            <div className="absolute -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-[-1px] pointer-events-none z-20" />
            <div className="absolute -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-[-1px] pointer-events-none z-20" />
          </div>

          {project.slug === "sti-elms" ? (
            <div
              className="col-span-2 md:col-span-1 flex items-center justify-center gap-2 text-[13px] font-medium text-rose-500/80 cursor-not-allowed mt-4 md:mt-0"
              title="Confidential - School Project"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Confidential
            </div>
          ) : (
            <TransitionLink
              href={`/projects/${project.slug}/how-its-made`}
              direction="right"
              className="col-span-2 md:col-span-1 flex items-center justify-center gap-2 text-[13px] font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mt-4 md:mt-0"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
              How it&apos;s made
            </TransitionLink>
          )}
        </div>

        {/* Bottom Dashed Divider */}
        <div className="relative mb-8">
          <div
            className="absolute left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
            style={{
              maskImage:
                "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
              WebkitMaskImage:
                "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
            }}
          />
          <div className="absolute -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-[-1px] pointer-events-none z-20" />
          <div className="absolute -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-[-1px] pointer-events-none z-20" />
        </div>

        {/* Title and Status Header */}
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

        {/* Description Section */}
        <div className="mb-10">
          <h2 className="text-[16px] font-bold text-zinc-900 dark:text-zinc-50 tracking-tight mb-3">Overview</h2>
          <p className="text-[14px] text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
            {project.description}
          </p>
        </div>

        {/* Tech Stack */}
        <div>
          <h2 className="text-[16px] font-bold text-zinc-900 dark:text-zinc-50 tracking-tight mb-4">Stack used</h2>
          <div className="flex flex-wrap gap-2 w-full">
            {project.tech.map((t: TechItem, i: number) => {
              const isKey = typeof t === "string";
              const label = isKey ? techNames[t as TechKey] : t.label;
              const Icon = isKey ? iconMap[t as TechKey] : null;

              return (
                <div key={i} className="grow flex whitespace-nowrap items-center justify-center gap-2 px-3 py-1.5 bg-zinc-50 hover:bg-zinc-100 dark:bg-[#0a0a0a] dark:hover:bg-[#121214] border border-black/30 dark:border-white/[0.15] rounded-[6px] transition-colors duration-200 cursor-default">
                  {Icon && <Icon className="w-3.5 h-3.5 shrink-0 opacity-80 text-zinc-500 dark:text-zinc-400" aria-hidden="true" />}
                  <span className="text-[13px] font-medium text-zinc-600 dark:text-zinc-400">{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </BlueprintGrid>
  );
}
