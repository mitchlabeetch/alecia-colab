"use client";
import { staggerContainerVariants } from "@/lib/animations/variants";
import { motion } from "motion/react";
import type { ReactNode } from "react";

export function AnimatedList({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="initial"
      animate="animate"
      className={className}
    >
      {children}
    </motion.div>
  );
}
