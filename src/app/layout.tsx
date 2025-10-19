import type { Metadata } from "next";
import { Space_Grotesk, Lora } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider } from '@clerk/nextjs'

const fontSpaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

const fontLora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
});


export const metadata: Metadata = {
  title: "SamrAI",
  description: "Intelligent Investment Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
        <html lang="en" className="dark">
        <body className={cn("antialiased", fontSpaceGrotesk.variable, fontLora.variable)}>
            {children}
            <Toaster />
        </body>
        </html>
    </ClerkProvider>
  );
}
