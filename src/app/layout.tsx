import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Doto } from "next/font/google";
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
import { TextSelectionMenu } from "@/components/text-selection-menu";
import { Toaster } from "@/components/ui/toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const doto = Doto({
  variable: "--font-doto",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  colorScheme: "light dark",
};

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
  other: {
    "color-scheme": "light dark",
    "supported-color-schemes": "light dark",
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
      className={`${geistSans.variable} ${geistMono.variable} ${doto.variable} h-full antialiased`}
    >
      <head>
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
      </head>
      <body className="min-h-full flex flex-col dark:bg-black dark:text-zinc-50">
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
                    <main className="flex-grow flex flex-col">
                      {children}
                    </main>
                  </GlobalContextMenu>
                  <TextSelectionMenu />
                </TransitionProvider>
              </TooltipProvider>
            </SoundProvider>
          </HardwareProvider>
        </ThemeProvider>
        {process.env.VERCEL === "1" && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
        <GlobalConsoleWarning />
        <Toaster />
      </body>
    </html>
  );
}
