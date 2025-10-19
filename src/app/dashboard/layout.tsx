import { Pyramid } from 'lucide-react';
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { DashboardNav } from "@/components/dashboard/Nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-screen bg-background text-foreground flex flex-col font-sans">
      <header className="bg-background/80 backdrop-blur-sm border-b border-border p-4 sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <Pyramid className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-white">
              SamrAI
            </span>
          </Link>
          <UserButton />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <DashboardNav />
        <main className="flex-1 overflow-auto bg-grid relative p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
