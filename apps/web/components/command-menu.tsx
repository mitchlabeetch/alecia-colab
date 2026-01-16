"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Briefcase, Building, FileText, History, LayoutGrid, PlusCircle, Settings, Users } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/tailwind/ui/command";
import { useCommandMenu } from "./command-menu-provider";

export function CommandMenu() {
  const router = useRouter();
  const { open, setOpen } = useCommandMenu();

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false);
      command();
    },
    [setOpen],
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search a command..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() => {
              runCommand(() => console.log("New Deal"));
            }}
          >
            <PlusCircle className="mr-2 h-4 w-4 text-blue-500" />
            <span>New Deal</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              runCommand(() => router.push("/documents/new"));
            }}
          >
            <FileText className="mr-2 h-4 w-4 text-green-500" />
            <span>New Note</span>
            <CommandShortcut>⌘⇧N</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Navigation">
          <CommandItem
            onSelect={() => {
              runCommand(() => router.push("/pipeline"));
            }}
          >
            <LayoutGrid className="mr-2 h-4 w-4 text-purple-500" />
            <span>Pipeline</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              runCommand(() => router.push("/pipeline"));
            }}
          >
            <Briefcase className="mr-2 h-4 w-4 text-orange-500" />
            <span>Search Deals</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              runCommand(() => router.push("/companies"));
            }}
          >
            <Building className="mr-2 h-4 w-4 text-indigo-500" />
            <span>Companies</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              runCommand(() => router.push("/team"));
            }}
          >
            <Users className="mr-2 h-4 w-4 text-pink-500" />
            <span>Team</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              runCommand(() => router.push("/recent"));
            }}
          >
            <History className="mr-2 h-4 w-4 text-gray-500" />
            <span>History</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="System">
          <CommandItem
            onSelect={() => {
              runCommand(() => router.push("/settings"));
            }}
          >
            <Settings className="mr-2 h-4 w-4 text-gray-500" />
            <span>Settings</span>
            <CommandShortcut>⌘,</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
