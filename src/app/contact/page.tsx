"use client";

import React, { useState, useSyncExternalStore } from "react";
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
import { DEFAULT_TEXT } from "@/components/swirl/default-text";
import { DEFAULT_STAGE } from "@/components/swirl/use-swirl-stage";
import dynamic from "next/dynamic";

// WebGL stage — keep the swirl engine out of the route's initial bundle.
const ExperimentStage = dynamic(
  () => import("@/components/swirl/experiment-stage").then((mod) => mod.ExperimentStage),
  { ssr: false }
);
import { DOT_MASK_HORIZONTAL } from "@/lib/blueprint";

export default function ContactPage() {
  const { theme, resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  
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
    zoom: isMobile ? 1.0 : 0.75,
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
          mask-image: linear-gradient(to bottom, transparent 0%, transparent 10%, black 45%, black 100%);
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, transparent 10%, black 45%, black 100%);
        }
        @media (min-width: 768px) {
          .swirl-mask-responsive {
            mask-image: linear-gradient(to right, transparent 0%, transparent 12%, rgba(0,0,0,0.25) 32%, rgba(0,0,0,0.7) 52%, black 70%, black 100%);
            -webkit-mask-image: linear-gradient(to right, transparent 0%, transparent 12%, rgba(0,0,0,0.25) 32%, rgba(0,0,0,0.7) 52%, black 70%, black 100%);
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
        <div className="ml-3 mr-3 sm:ml-4 sm:mr-4 md:ml-[24.5%] md:mr-[24.5%] pt-[calc(22vh+112px)] pb-0 px-3 sm:px-4 min-h-screen flex flex-col justify-between z-10 relative">
          {/* Form */}
          <div className="mt-8 sm:mt-10 flex justify-center w-full px-0">
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
          <div className="relative mt-8 sm:mt-10 mb-0 -mx-3 sm:-mx-4 h-0">
            <div 
              className="absolute inset-x-0 h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none z-10"
              style={DOT_MASK_HORIZONTAL}
            />
            {/* Left & Right Corner Intersection Node Dots */}
            <div className="absolute hidden sm:block h-[2px] w-[2px] bg-black/50 dark:bg-white/[0.3] pointer-events-none z-30 left-0 top-0 -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute hidden sm:block h-[2px] w-[2px] bg-black/50 dark:bg-white/[0.3] pointer-events-none z-30 right-0 top-0 translate-x-1/2 -translate-y-1/2" />
          </div>

          {/* Footer - Socials + Displacement Text */}
          <div className="relative -mx-3 sm:-mx-4 mt-auto min-h-[220px] md:min-h-[240px] flex-1 flex flex-col md:flex-row md:items-center justify-between overflow-visible">
            <div className="flex-shrink-0 flex flex-col items-center md:items-start text-center md:text-left z-20 py-8 md:py-10 pl-6 sm:pl-8">
              <p className="text-[14px] text-zinc-500 mb-2">Find me on my <span className="font-medium text-zinc-800 dark:text-zinc-200">socials</span></p>
              <MorphingSocials 
                className="flex flex-wrap justify-center md:justify-start gap-1.5 relative z-50 w-full md:w-auto"
                socials={[
                  { name: 'GitHub', href: 'https://github.com/VidZid2', icon: <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" stroke="currentColor" strokeWidth="2" fill="none"></path> },
                  { name: 'Twitter', href: '#', disabled: true, icon: <path d="M4 4l11.733 16h4.267l-11.733 -16zM4 20l6.768 -6.768M20 4l-6.768 6.768" stroke="currentColor" strokeWidth="2" fill="none" /> },
                  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/josiah-deasis/', icon: <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1-2 2 2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2" fill="none"></path> },
                ]}
              />
            </div>

            {/* Spiral background expanding on top, bottom, and right to fill completely with no gaps */}
            <div className="absolute inset-0 md:left-[30%] pointer-events-none overflow-hidden swirl-mask-responsive">
              <ExperimentStage 
                config={swirlConfig} 
                trackPointer={true} 
                burstOnClick={true}
                seamless={true}
              />
            </div>
          </div>
        </div>
      </BlueprintGrid>
    </>
  );
}
