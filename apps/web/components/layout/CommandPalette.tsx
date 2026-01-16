"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/tailwind/ui/dialog";
import ActionSearchBar from "@/components/navigation/ActionSearchBar";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 border-0 bg-transparent shadow-none max-w-xl">
        <DialogTitle className="sr-only">Command Palette</DialogTitle>
        <ActionSearchBar
          defaultOpen={true}
          onActionSelect={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
