"use client";

/**
 * ProfileDropdown - Menu profil utilisateur avec Clerk
 * Adapté pour Alecia Colab - Interface française
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, Settings, LogOut, Moon, Sun, ChevronDown, Building, Bell } from "lucide-react";
import { useUser, useClerk } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

interface ProfileDropdownProps {
  className?: string;
}

export default function ProfileDropdown({ className }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const { signOut } = useClerk();

  // Fermer le dropdown au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Détecter le thème initial
  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
  };

  const handleSignOut = () => {
    signOut();
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const menuItems = [
    {
      icon: User,
      label: "Mon profil",
      onClick: () => {},
      divider: false,
    },
    {
      icon: Building,
      label: "Organisation",
      onClick: () => {},
      divider: false,
    },
    {
      icon: Bell,
      label: "Notifications",
      onClick: () => {},
      divider: false,
    },
    {
      icon: Settings,
      label: "Paramètres",
      onClick: () => {},
      divider: true,
    },
    {
      icon: isDarkMode ? Sun : Moon,
      label: isDarkMode ? "Mode clair" : "Mode sombre",
      onClick: toggleTheme,
      divider: true,
    },
    {
      icon: LogOut,
      label: "Se déconnecter",
      onClick: handleSignOut,
      divider: false,
      danger: true,
    },
  ];

  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      {/* Bouton déclencheur */}
      <motion.button
        className={cn(
          "flex items-center gap-2 rounded-lg px-2 py-1.5",
          "hover:bg-gray-100 dark:hover:bg-gray-800",
          "transition-colors duration-200",
          isOpen && "bg-gray-100 dark:bg-gray-800",
        )}
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.98 }}
      >
        {/* Avatar */}
        {user?.imageUrl ? (
          <img src={user.imageUrl} alt={user.fullName || "Avatar"} className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
            {getInitials(user?.fullName)}
          </div>
        )}

        {/* Nom et email (masqués sur mobile) */}
        <div className="hidden md:flex flex-col items-start">
          <span className="text-sm font-medium text-gray-900 dark:text-white">{user?.fullName || "Utilisateur"}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {user?.primaryEmailAddress?.emailAddress || ""}
          </span>
        </div>

        <ChevronDown
          className={cn("h-4 w-4 text-gray-500 transition-transform duration-200", isOpen && "rotate-180")}
        />
      </motion.button>

      {/* Menu dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute right-0 top-full mt-2 w-64 z-50",
              "rounded-lg border border-gray-200 dark:border-gray-700",
              "bg-white dark:bg-gray-900 shadow-lg",
            )}
          >
            {/* En-tête utilisateur */}
            <div className="p-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.fullName || "Avatar"}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-base font-medium">
                    {getInitials(user?.fullName)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user?.fullName || "Utilisateur"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.primaryEmailAddress?.emailAddress || ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu items */}
            <div className="py-1">
              {menuItems.map((item, index) => (
                <div key={item.label}>
                  <motion.button
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 text-sm",
                      "hover:bg-gray-100 dark:hover:bg-gray-800",
                      "transition-colors duration-150",
                      item.danger ? "text-red-600 dark:text-red-400" : "text-gray-700 dark:text-gray-300",
                    )}
                    onClick={item.onClick}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </motion.button>
                  {item.divider && <div className="my-1 border-t border-gray-100 dark:border-gray-800" />}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
