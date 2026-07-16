"use client";
import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  index = 0,
  tone = "default",
}: {
  label: string;
  value: string;
  delta?: string;
  icon: LucideIcon;
  index?: number;
  tone?: "default" | "signal" | "teal";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
    >
      <Card className="group relative overflow-hidden p-5 transition-shadow hover:shadow-md">
        <div
          className={cn(
            "pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100",
            tone === "signal" && "bg-signal/30",
            tone === "teal" && "bg-teal/30",
            tone === "default" && "bg-muted-foreground/10"
          )}
        />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <p className="mt-2 font-display text-2xl font-bold tracking-tight">{value}</p>
            {delta && <p className="mt-1 text-xs text-teal">{delta}</p>}
          </div>
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg",
              tone === "signal" && "bg-signal/15 text-signal",
              tone === "teal" && "bg-teal/15 text-teal",
              tone === "default" && "bg-muted text-muted-foreground"
            )}
          >
            <Icon className="h-[18px] w-[18px]" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
