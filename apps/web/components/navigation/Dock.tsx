"use client";

/**
 * Dock - Navigation inférieure type macOS
 * Adapté pour Alecia Colab - Interface française
 */

import { cn } from "@/lib/utils";
import { Briefcase, FileText, Home, Settings } from "lucide-react";
import {
  AnimatePresence,
  type MotionValue,
  type SpringOptions,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import React, { Children, cloneElement, useEffect, useMemo, useRef, useState } from "react";

export interface DockItemData {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}

interface DockProps {
  items?: DockItemData[];
  className?: string;
  distance?: number;
  panelHeight?: number;
  baseItemSize?: number;
  magnification?: number;
  spring?: SpringOptions;
}

interface DockItemProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  mouseX: MotionValue<number>;
  spring: SpringOptions;
  distance: number;
  baseItemSize: number;
  magnification: number;
}

function DockItem({
  children,
  className = "",
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
}: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize,
    };
    return val - rect.x - baseItemSize / 2;
  });

  const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize]);
  const size = useSpring(targetSize, spring);

  return (
    <motion.div
      ref={ref}
      style={{ width: size, height: size }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center justify-center",
        "rounded-xl bg-white dark:bg-gray-900",
        "border border-gray-200 dark:border-gray-700",
        "shadow-sm cursor-pointer outline-none",
        "hover:shadow-md transition-shadow duration-200",
        className,
      )}
      tabIndex={0}
      role="button"
    >
      {Children.map(children, (child) =>
        React.isValidElement(child)
          ? cloneElement(child as React.ReactElement<{ isHovered?: MotionValue<number> }>, { isHovered })
          : child,
      )}
    </motion.div>
  );
}

interface DockLabelProps {
  className?: string;
  children: React.ReactNode;
  isHovered?: MotionValue<number>;
}

function DockLabel({ children, className = "", isHovered }: DockLabelProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return;
    const unsubscribe = isHovered.on("change", (latest) => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "absolute -top-8 left-1/2 -translate-x-1/2",
            "w-max whitespace-nowrap",
            "rounded-md border border-gray-200 dark:border-gray-700",
            "bg-white dark:bg-gray-900 px-2 py-1",
            "text-xs font-medium text-gray-900 dark:text-white",
            "shadow-sm",
            className,
          )}
          role="tooltip"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface DockIconProps {
  className?: string;
  children: React.ReactNode;
}

function DockIcon({ children, className = "" }: DockIconProps) {
  return (
    <div className={cn("flex items-center justify-center", "text-gray-600 dark:text-gray-400", className)}>
      {children}
    </div>
  );
}

// Configuration par défaut en français
const defaultItems: DockItemData[] = [
  {
    icon: <Home className="h-5 w-5" />,
    label: "Accueil",
    onClick: () => {},
  },
  {
    icon: <Briefcase className="h-5 w-5" />,
    label: "Pipeline",
    onClick: () => {},
  },
  {
    icon: <FileText className="h-5 w-5" />,
    label: "Documents",
    onClick: () => {},
  },
  {
    icon: <Settings className="h-5 w-5" />,
    label: "Paramètres",
    onClick: () => {},
  },
];

export default function Dock({
  items = defaultItems,
  className = "",
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 70,
  distance = 200,
  panelHeight = 64,
  baseItemSize = 48,
}: DockProps) {
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY);
  const isHovered = useMotionValue(0);

  const maxHeight = useMemo(
    () => Math.max(panelHeight + 20, magnification + magnification / 2 + 4),
    [magnification, panelHeight],
  );
  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  return (
    <motion.div style={{ height }} className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <motion.div
        onMouseMove={({ pageX }) => {
          isHovered.set(1);
          mouseX.set(pageX);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Number.POSITIVE_INFINITY);
        }}
        className={cn(
          "flex items-end gap-3 px-3 pb-2",
          "rounded-2xl border border-gray-200 dark:border-gray-700",
          "bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg",
          "shadow-lg",
          className,
        )}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Navigation principale"
      >
        {items.map((item, index) => (
          <DockItem
            key={index}
            onClick={item.onClick}
            className={item.className}
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
          >
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel>{item.label}</DockLabel>
          </DockItem>
        ))}
      </motion.div>
    </motion.div>
  );
}
