"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function RadarPulse({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <div className={cn("relative flex shrink-0 items-center justify-center", className)} style={{ width: size, height: size }}>
      <span className="absolute inset-0 rounded-full bg-signal/25 animate-pulse-ring" />
      <span className="absolute inset-0 rounded-full bg-signal/15" style={{ animationDelay: "0.6s" }} />
      <div className="relative z-10 flex items-center justify-center rounded-full bg-signal shadow-[0_0_18px_-2px_hsl(var(--signal)/0.7)]" style={{ width: size * 0.62, height: size * 0.62 }}>
        <motion.svg
          viewBox="0 0 24 24"
          width={size * 0.36}
          height={size * 0.36}
          className="text-signal-foreground"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
        >
          <path
            d="M12 2 A10 10 0 0 1 21.5 14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </motion.svg>
      </div>
    </div>
  );
}
