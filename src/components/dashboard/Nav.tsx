"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { TrendingUp, GanttChart, BarChart, Target, BookUser, Landmark, Grid3x3, Newspaper, Eye, BarChart3, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard/portfolio", label: "Portfolio", icon: TrendingUp },
  { href: "/dashboard/heatmap", label: "Heatmap", icon: Grid3x3 },
  { href: "/dashboard/charts", label: "Charts", icon: BarChart3 },
  { href: "/dashboard/search", label: "Watchlist", icon: Eye },
  { href: "/dashboard/news", label: "News", icon: Newspaper },
  { href: "/dashboard/predictions", label: "Predictions", icon: GanttChart },
  { href: "/dashboard/advisor", label: "AI Advisor", icon: BookUser },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart },
  { href: "/dashboard/goals", label: "Goals", icon: Target },
  { href: "/dashboard/accounts", label: "Accounts", icon: Landmark },
];

// Mobile: Show only key items
const mobileNavItems = [
  { href: "/dashboard/portfolio", label: "Portfolio", icon: TrendingUp },
  { href: "/dashboard/charts", label: "Charts", icon: BarChart3 },
  { href: "/dashboard/advisor", label: "Advisor", icon: BookUser },
  { href: "/dashboard/news", label: "News", icon: Newspaper },
  { href: "/dashboard/goals", label: "Goals", icon: Target },
];

export function DashboardNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex bg-background/80 border-r border-border p-4 flex-col items-center gap-4 overflow-y-auto">
        <TooltipProvider>
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Tooltip key={href}>
                <TooltipTrigger asChild>
                  <Link
                    href={href}
                    className={cn(
                      "flex items-center justify-center p-3 rounded-lg transition-colors group",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <Icon className="w-6 h-6" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-50">
        <div className="flex items-center justify-around px-2 py-2">
          {mobileNavItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors min-w-[60px]",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            );
          })}
          
          {/* More Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors min-w-[60px] text-muted-foreground">
                <Menu className="w-5 h-5" />
                <span className="text-[10px] font-medium">More</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[70vh]">
              <SheetHeader>
                <SheetTitle>All Pages</SheetTitle>
              </SheetHeader>
              <div className="grid grid-cols-2 gap-3 mt-6">
                {navItems.map(({ href, label, icon: Icon }) => {
                  const isActive = pathname.startsWith(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex flex-col items-center justify-center gap-3 p-4 rounded-lg border transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border hover:bg-accent"
                      )}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="text-sm font-medium">{label}</span>
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </>
  );
}
