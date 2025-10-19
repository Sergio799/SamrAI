"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { TrendingUp, GanttChart, BarChart, Target, BookUser, Landmark, Grid3x3, Newspaper, Eye, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-background/80 border-r border-border p-4 flex flex-col items-center gap-4">
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
  );
}
