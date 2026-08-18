"use client";

import React, { useState } from "react";
import {
  GlassForm,
  FormGroup,
  FormField,
  FormButton,
} from "@/components/ruixen/glass-form";
import { BlueprintGrid } from "@/components/BlueprintGrid";
import { SubpageHeader } from "@/components/SubpageHeader";
import { MorphingSocials } from "@/components/pixel-perfect/morphing-socials";
import { useTheme } from "next-themes";
import { ExperimentStage } from "@/components/swirl/experiment-stage";
import { DEFAULT_TEXT } from "@/components/swirl/default-text";
import { DEFAULT_STAGE } from "@/components/swirl/use-swirl-stage";

export default function ContactPage() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  React.useEffect(() => setMounted(true), []);
  
  const isDark = mounted && (theme === "dark" || resolvedTheme === "dark");
  const isMobile = mounted && window.innerWidth < 768;

  const swirlConfig = {
    ...DEFAULT_STAGE,
    word: "JOSIAH",
    style: "slant" as const,
    inkStops: isDark ? ["#6495ED", "#4A70B2", "#2B4168"] : ["#000000", "#555555", "#999999"],
    logoColor: isDark ? "#6495ED" : "#000000",
    gradient: true,
    gradientAngle: Math.PI / 4,
    gradientFlow: 0.2,
    bg: isDark ? "#000000" : "#ffffff",
    text: DEFAULT_TEXT,
    zoom: isMobile ? 1.2 : 0.85,
    trail: true,
    trailStrength: 1.5,
    shock: true,
    turbulence: 0.2,
    wavePattern: "wavefront" as const,
    aberration: 0.5,
    scanlines: 0.2,
    curvature: 0.2,
    rootMargin: "0px",
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.message.trim() !== "";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch(
        "https://formsubmit.co/ajax/Josiahdeasis009@gmail.com",
        {
          method: "POST",
          body: data,
        }
      );

      if (response.ok) {
        form.reset();
        setFormData({ name: "", email: "", message: "" });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus,
        textarea:-webkit-autofill,
        textarea:-webkit-autofill:hover,
        textarea:-webkit-autofill:focus {
          -webkit-text-fill-color: var(--autofill-text) !important;
          -webkit-box-shadow: 0 0 0px 1000px var(--autofill-bg) inset !important;
          transition: background-color 5000s ease-in-out 0s;
        }
        :root {
          --autofill-bg: white;
          --autofill-text: #171717;
        }
        .dark {
          --autofill-bg: black;
          --autofill-text: #fafafa;
        }
        .swirl-mask-responsive {
          mask-image: linear-gradient(to bottom, transparent 0%, transparent 15%, black 40%, black 100%);
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, transparent 15%, black 40%, black 100%);
        }
        @media (min-width: 768px) {
          .swirl-mask-responsive {
            mask-image: linear-gradient(to right, transparent 0%, transparent 15%, black 40%, black 100%);
            -webkit-mask-image: linear-gradient(to right, transparent 0%, transparent 15%, black 40%, black 100%);
          }
        }
      `}} />
      <BlueprintGrid
        headerSlot={
          <SubpageHeader
            title="Contact"
            subtitle="Open for meaningful work."
            backHref="/"
          />
        }
      >
        {/* Content Section */}
        <div className="ml-0 mr-0 md:ml-[26%] md:mr-[26%] pt-[calc(22vh+112px)] pb-16 md:pb-24 px-4 flex flex-col z-10 relative">
          {/* Form */}
          <div className="mt-12 flex justify-center w-full px-0">
            <GlassForm onSubmit={handleSubmit} style={{ margin: "0 auto", width: "100%", maxWidth: "480px" }}>
              <FormGroup title="Contact Details">
                <FormField
                  name="name"
                  label="Full Name"
                  placeholder="Tyler Durden"
                  value={formData.name}
                  onChange={(val) => setFormData({ ...formData, name: val })}
                />
                <FormField
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="tyler@projectmayhem.com"
                  value={formData.email}
                  onChange={(val) => setFormData({ ...formData, email: val })}
                />
                <FormField
                  name="message"
                  label="Message"
                  type="textarea"
                  placeholder="You're crazy good, never change."
                  value={formData.message}
                  onChange={(val) => setFormData({ ...formData, message: val })}
                />
              </FormGroup>

              {/* FormSubmit Configuration (Hidden) */}
              <div style={{ display: 'none' }}>
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_template" value="box" />
                <input type="hidden" name="_subject" value="New Submission from Portfolio" />
                <input type="text" name="_honey" style={{ display: "none" }} />
              </div>

              <div className="pt-2 w-full">
                <FormButton type="submit" disabled={isSubmitting || !isFormValid}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </FormButton>
              </div>
            </GlassForm>
          </div>

          {/* Separator */}
          <div className="relative mt-16 mb-0">
            <div className="absolute left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none" style={{ maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' }} />
            {/* Intersection nodes */}
            <div className="absolute -left-8 md:-left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-[-1px] pointer-events-none z-20" />
            <div className="absolute -right-8 md:-right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-[-1px] pointer-events-none z-20" />
          </div>

          {/* Footer - Socials + Displacement Text */}
          <div className="pt-6 md:pt-0 pb-0 md:pb-24 px-0 md:px-4 flex flex-col md:flex-row md:items-start justify-between gap-8 overflow-visible">
            <div className="flex-shrink-0 flex flex-col items-center md:items-start text-center md:text-left md:mt-[80px]">
              <p className="text-[14px] text-zinc-500 mb-2">Find me on my <span className="font-medium text-zinc-800 dark:text-zinc-200">socials</span></p>
              <MorphingSocials 
                className="flex flex-wrap justify-center md:justify-start gap-1.5 relative z-50 w-full md:w-auto"
                socials={[
                  { name: 'GitHub', href: 'https://github.com/VidZid2', icon: <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" stroke="currentColor" strokeWidth="2" fill="none"></path> },
                  { name: 'Twitter', href: '#', disabled: true, icon: <path d="M4 4l11.733 16h4.267l-11.733 -16zM4 20l6.768 -6.768M20 4l-6.768 6.768" stroke="currentColor" strokeWidth="2" fill="none" /> },
                  { name: 'LinkedIn', href: '#', icon: <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1-2 2 2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2" fill="none"></path> },
                ]}
              />
            </div>

            <div className="flex-grow h-[280px] md:h-[68px] relative flex items-center justify-center md:justify-end mt-4 md:mt-0 -mx-4 md:mx-0 -mb-0 md:mb-0">
              <div className="absolute pointer-events-none inset-x-0 md:inset-x-auto md:-right-8 inset-y-0 md:inset-y-auto md:top-0 w-full md:w-[500px] md:h-[240px] overflow-hidden swirl-mask-responsive">
                <ExperimentStage 
                  config={swirlConfig} 
                  trackPointer={true} 
                  burstOnClick={true}
                  seamless={true}
                />
              </div>
            </div>
          </div>
        </div>
      </BlueprintGrid>
    </>
  );
}
