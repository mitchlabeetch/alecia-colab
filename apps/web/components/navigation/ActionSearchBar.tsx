"use client";

/**
 * ActionSearchBar - Barre de recherche et commandes rapides
 * Adapté pour Alecia Colab - Interface française
 */

import { Input } from "@/components/tailwind/ui/input";
import useDebounce from "@/hooks/use-debounce";
import {
  Briefcase,
  Building,
  FileText,
  History,
  LayoutGrid,
  PlusCircle,
  Search,
  Send,
  Settings,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";

interface Action {
  id: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
  shortcut?: string;
  category?: string;
}

interface ActionSearchBarProps {
  actions?: Action[];
  defaultOpen?: boolean;
  onActionSelect?: (action: Action) => void;
  placeholder?: string;
}

const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0, height: 0 },
    show: {
      opacity: 1,
      height: "auto",
      transition: {
        height: { duration: 0.4 },
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.2 },
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2 },
    },
  },
} as const;

const defaultActions: Action[] = [
  {
    id: "new-deal",
    label: "Nouveau deal",
    icon: <PlusCircle className="h-4 w-4 text-blue-500" />,
    description: "Créer un nouveau deal",
    shortcut: "⌘N",
    category: "Actions",
  },
  {
    id: "new-note",
    label: "Nouvelle note",
    icon: <FileText className="h-4 w-4 text-green-500" />,
    description: "Créer un document",
    shortcut: "⌘⇧N",
    category: "Actions",
  },
  {
    id: "pipeline",
    label: "Pipeline",
    icon: <LayoutGrid className="h-4 w-4 text-purple-500" />,
    description: "Voir le pipeline",
    shortcut: "⌘P",
    category: "Navigation",
  },
  {
    id: "deals",
    label: "Rechercher deals",
    icon: <Briefcase className="h-4 w-4 text-orange-500" />,
    description: "Tous les deals",
    category: "Navigation",
  },
  {
    id: "companies",
    label: "Sociétés",
    icon: <Building className="h-4 w-4 text-indigo-500" />,
    description: "Liste des sociétés",
    category: "Navigation",
  },
  {
    id: "team",
    label: "Équipe",
    icon: <Users className="h-4 w-4 text-pink-500" />,
    description: "Collaborateurs",
    category: "Navigation",
  },
  {
    id: "history",
    label: "Historique",
    icon: <History className="h-4 w-4 text-gray-500" />,
    description: "Activité récente",
    category: "Navigation",
  },
  {
    id: "settings",
    label: "Paramètres",
    icon: <Settings className="h-4 w-4 text-gray-500" />,
    description: "Configuration",
    shortcut: "⌘,",
    category: "Système",
  },
];

export default function ActionSearchBar({
  actions = defaultActions,
  defaultOpen = false,
  onActionSelect,
  placeholder = "Rechercher une commande...",
}: ActionSearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(defaultOpen);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, 200);

  const filteredActions = useMemo(() => {
    if (!debouncedQuery) return actions;

    const normalizedQuery = debouncedQuery.toLowerCase().trim();
    return actions.filter((action) => {
      const searchableText = `${action.label} ${action.description || ""}`.toLowerCase();
      return searchableText.includes(normalizedQuery);
    });
  }, [debouncedQuery, actions]);

  useEffect(() => {
    if (!isFocused) {
      setActiveIndex(-1);
    } else {
      setActiveIndex(-1);
    }
  }, [filteredActions, isFocused]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setActiveIndex(-1);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!filteredActions.length) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) => (prev < filteredActions.length - 1 ? prev + 1 : 0));
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : filteredActions.length - 1));
          break;
        case "Enter":
          e.preventDefault();
          if (activeIndex >= 0 && filteredActions[activeIndex]) {
            onActionSelect?.(filteredActions[activeIndex]);
          }
          break;
        case "Escape":
          setIsFocused(false);
          setActiveIndex(-1);
          break;
      }
    },
    [filteredActions, activeIndex, onActionSelect],
  );

  const handleActionClick = useCallback(
    (action: Action) => {
      onActionSelect?.(action);
      setIsFocused(false);
      setQuery("");
    },
    [onActionSelect],
  );

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="relative flex flex-col justify-start items-center min-h-[300px]">
        <div className="w-full max-w-sm sticky top-0 bg-background z-10 pt-4 pb-1">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block" htmlFor="action-search">
            Commandes
          </label>
          <div className="relative">
            <Input
              type="text"
              placeholder={placeholder}
              value={query}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              onKeyDown={handleKeyDown}
              role="combobox"
              aria-expanded={isFocused}
              aria-autocomplete="list"
              id="action-search"
              autoComplete="off"
              className="pl-3 pr-9 py-1.5 h-9 text-sm rounded-lg focus-visible:ring-offset-0"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4">
              <AnimatePresence mode="popLayout">
                {query.length > 0 ? (
                  <motion.div
                    key="send"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Send className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="search"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Search className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="w-full max-w-sm">
          <AnimatePresence>
            {isFocused && (
              <motion.div
                className="w-full border rounded-md shadow-xs overflow-hidden dark:border-gray-800 bg-white dark:bg-black mt-1"
                variants={ANIMATION_VARIANTS.container}
                role="listbox"
                aria-label="Résultats de recherche"
                initial="hidden"
                animate="show"
                exit="exit"
              >
                <motion.ul>
                  {filteredActions.map((action, index) => (
                    <motion.li
                      key={action.id}
                      id={`action-${action.id}`}
                      className={`px-3 py-2 flex items-center justify-between hover:bg-gray-200 dark:hover:bg-zinc-900 cursor-pointer rounded-md ${
                        activeIndex === index ? "bg-gray-100 dark:bg-zinc-800" : ""
                      }`}
                      variants={ANIMATION_VARIANTS.item}
                      layout
                      onClick={() => handleActionClick(action)}
                      role="option"
                      aria-selected={activeIndex === index}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500" aria-hidden="true">
                          {action.icon}
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{action.label}</span>
                        {action.description && <span className="text-xs text-gray-400">{action.description}</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        {action.shortcut && <span className="text-xs text-gray-400">{action.shortcut}</span>}
                        {action.category && <span className="text-xs text-gray-400 text-right">{action.category}</span>}
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>
                <div className="mt-2 px-3 py-2 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Appuyez sur ⌘K pour ouvrir</span>
                    <span>ESC pour fermer</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
