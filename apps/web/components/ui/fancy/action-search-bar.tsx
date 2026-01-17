"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Calendar,
  FileText,
  Home,
  Moon,
  Plus,
  Sparkles,
  Sun,
  User,
  Users,
} from "lucide-react";

import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/tailwind/ui/command";

interface ActionSearchBarProps {
  setOpen?: (open: boolean) => void;
}

export function ActionSearchBar({ setOpen }: ActionSearchBarProps) {
  const router = useRouter();
  const { setTheme } = useTheme();

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      if (setOpen) {
        setOpen(false);
      }
      command();
    },
    [setOpen]
  );

  return (
    <>
      <CommandInput placeholder="Tapez une commande ou cherchez..." />
      <CommandList>
        <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>

        <CommandGroup heading="Navigation">
          <CommandItem
            onSelect={() => {
              runCommand(() => router.push("/"));
            }}
          >
            <Home className="mr-2 h-4 w-4" />
            <span>Aller à l'accueil</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              runCommand(() => router.push("/calendar"));
            }}
          >
            <Calendar className="mr-2 h-4 w-4" />
            <span>Ouvrir le calendrier</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              runCommand(() => router.push("/team"));
            }}
          >
            <Users className="mr-2 h-4 w-4" />
            <span>Voir les équipes</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Création">
          <CommandItem
            onSelect={() => {
              runCommand(() => router.push("/documents/new"));
            }}
          >
            <FileText className="mr-2 h-4 w-4" />
            <span>Nouveau Document</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              runCommand(() => router.push("/deals/new"));
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            <span>Nouveau Deal</span>
            <CommandShortcut>⌘D</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Intelligence Artificielle">
          <CommandItem
            onSelect={() => {
              runCommand(() => router.push("/ai")); // Or invoke AI modal
            }}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            <span>Demander à Alecia...</span>
            <CommandShortcut>⌘J</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Paramètres">
          <CommandItem
            onSelect={() => {
              runCommand(() => setTheme("light"));
            }}
          >
            <Sun className="mr-2 h-4 w-4" />
            <span>Thème clair</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              runCommand(() => setTheme("dark"));
            }}
          >
            <Moon className="mr-2 h-4 w-4" />
            <span>Thème sombre</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              runCommand(() => router.push("/settings/profile"));
            }}
          >
            <User className="mr-2 h-4 w-4" />
            <span>Mon profil</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </>
  );
}
