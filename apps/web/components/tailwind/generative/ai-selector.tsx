import type { Editor } from "@tiptap/core";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { AI_ACTIONS } from "./ai-actions";
import { Sparkles } from "lucide-react";
import { useCompletion } from "ai/react";
import { toast } from "sonner";

interface AISelectorProps {
  editor: Editor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AISelector({ editor, open, onOpenChange }: AISelectorProps) {
  const { complete: _complete, isLoading: _isLoading } = useCompletion({
    api: "/api/generate",
    onResponse: (response) => {
      if (response.status === 429) {
        toast.error("Limite de débit atteinte.");
        return;
      }
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  const [inputValue, setInputValue] = useState("");

  const handleAction = async (action: typeof AI_ACTIONS[number]) => {
    const selection = editor.state.selection;
    const text = editor.state.doc.textBetween(
      selection.from,
      selection.to,
      " "
    );

    if (!text) {
      toast.error("Veuillez sélectionner du texte pour utiliser l'IA.");
      return;
    }

    const prompt = `${action.prompt}:\n"${text}"`;

    // Simplification for this batch: just logging the intent as full integration requires API route setup
    console.log("AI Action triggered:", action.value, prompt);

    // To make it real, we'd call complete(prompt) and handle the stream
    // complete(prompt);

    toast.success(`Action IA "${action.label}" lancée (Simulation)`);
    onOpenChange(false);
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="gap-2 rounded-none border-none text-purple-500 hover:text-purple-600"
          size="sm"
        >
          <Sparkles className="h-4 w-4" />
          IA
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Demander à l'IA..."
            value={inputValue}
            onValueChange={setInputValue}
            autoFocus
          />
          <CommandList>
            <CommandEmpty>Aucune action trouvée.</CommandEmpty>
            <CommandGroup heading="Actions IA">
              {AI_ACTIONS.map((action) => (
                <CommandItem
                  key={action.value}
                  onSelect={() => handleAction(action)}
                  className="flex cursor-pointer items-center gap-2"
                >
                  {action.icon}
                  <span>{action.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
