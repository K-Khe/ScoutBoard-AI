"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { navGroups } from "@/components/layout/nav-data";
import { RadarPulse } from "@/components/dashboard/radar-pulse";
import { CreditMeter } from "@/components/dashboard/credit-meter";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function SidebarNav({ collapsed = false, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className={cn("flex items-center gap-2.5 px-4 py-5", collapsed && "justify-center px-2")}>
        <RadarPulse size={34} />
        {!collapsed && (
          <div className="leading-tight">
            <p className="font-display text-sm font-bold tracking-tight">ScoutBoard</p>
            <p className="text-[11px] text-muted-foreground">Marketplace Intelligence</p>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 px-2 scrollbar-thin">
        <nav className="flex flex-col gap-5 pb-4">
          {navGroups.map((group) => (
            <div key={group.title}>
              {!collapsed && (
                <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                  {group.title}
                </p>
              )}
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const active = pathname === item.href;
                  const link = (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "group relative flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                        collapsed && "justify-center px-2",
                        active
                          ? "bg-accent text-accent-foreground font-medium"
                          : "text-sidebar-foreground/80 hover:bg-accent/60 hover:text-accent-foreground"
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="active-nav-bar"
                          className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-signal"
                          transition={{ type: "spring", stiffness: 500, damping: 40 }}
                        />
                      )}
                      <item.icon className={cn("h-[18px] w-[18px] shrink-0", active ? "text-signal" : "text-muted-foreground")} />
                      {!collapsed && (
                        <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <span className="rounded-full bg-signal/15 px-1.5 py-0.5 text-[10px] font-semibold text-signal">
                              {item.badge}
                            </span>
                          )}
                        </span>
                      )}
                    </Link>
                  );

                  if (collapsed) {
                    return (
                      <Tooltip key={item.href} delayDuration={0}>
                        <TooltipTrigger asChild>{link}</TooltipTrigger>
                        <TooltipContent side="right">{item.label}</TooltipContent>
                      </Tooltip>
                    );
                  }
                  return link;
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {!collapsed && (
        <div className="border-t border-sidebar-border p-3">
          <CreditMeter />
        </div>
      )}
    </div>
  );
}

export function DesktopSidebar() {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ type: "spring", stiffness: 300, damping: 32 }}
      className="relative hidden shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex md:flex-col"
    >
      <SidebarNav collapsed={collapsed} />
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm hover:text-foreground"
        aria-label={collapsed ? "ขยายเมนู" : "ย่อเมนู"}
      >
        {collapsed ? <ChevronsRight className="h-3.5 w-3.5" /> : <ChevronsLeft className="h-3.5 w-3.5" />}
      </button>
    </motion.aside>
  );
}
