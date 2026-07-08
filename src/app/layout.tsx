import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TransitionProvider } from "@/components/TransitionProvider";
import { HardwareProvider } from "@/components/providers/hardware-provider";
import { SoundProvider } from "@/components/providers/sound-provider";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GlobalConsoleWarning } from "@/components/ui/global-console-warning";
import { GlobalContextMenu } from "@/components/global-context-menu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Josiah De Asis",
  description:
    "Full-Stack Front-End Engineer & UI Systems Architect. I design and build enterprise-scale web applications with obsessive attention to micro-interaction, gamification, and pixel-perfect design.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "256x256" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },
  openGraph: {
    title: "Josiah De Asis",
    description:
      "Full-Stack Front-End Engineer & UI Systems Architect.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col dark:bg-black dark:text-zinc-50 transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <HardwareProvider>
            <SoundProvider>
              <TooltipProvider>
                <TransitionProvider>
                  <GlobalContextMenu>
                    {children}
                  </GlobalContextMenu>
                </TransitionProvider>
              </TooltipProvider>
            </SoundProvider>
          </HardwareProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        <GlobalConsoleWarning />
      </body>
    </html>
  );
}
