import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import { Providers } from "@/components/providers";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "mermaid2diagram: From Mermaid code to beautiful diagrams",
    template: "%s · mermaid2diagram",
  },
  description:
    "Write or paste Mermaid syntax, preview diagrams instantly, refine the details and export crisp SVG, PNG, PDF or JPEG, entirely in your browser.",
  keywords: [
    "mermaid",
    "diagram",
    "flowchart",
    "sequence diagram",
    "svg export",
    "developer tools",
  ],
  authors: [{ name: "mermaid2diagram" }],
  openGraph: {
    title: "mermaid2diagram: From Mermaid code to beautiful diagrams",
    description:
      "An instant, in-browser Mermaid editor with premium export options.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="min-h-dvh bg-background font-sans text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>{children}</Providers>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
