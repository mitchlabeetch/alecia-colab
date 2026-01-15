"use client";

import { 
  Check, 
  Menu as MenuIcon, 
  Monitor, 
  Moon, 
  SunDim, 
  FileText, 
  Briefcase, 
  Building,
  Download,
  Share2,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Separator } from "./separator";

const appearances = [
  {
    theme: "System",
    icon: <Monitor className="h-4 w-4" />,
  },
  {
    theme: "Light",
    icon: <SunDim className="h-4 w-4" />,
  },
  {
    theme: "Dark",
    icon: <Moon className="h-4 w-4" />,
  },
];

const quickActions = [
  {
    label: "New Deal",
    icon: <Briefcase className="h-4 w-4" />,
    action: "deal",
  },
  {
    label: "New Company Profile",
    icon: <Building className="h-4 w-4" />,
    action: "company",
  },
  {
    label: "New Document",
    icon: <FileText className="h-4 w-4" />,
    action: "document",
  },
];

export default function Menu() {
  const { theme: currentTheme, setTheme } = useTheme();

  const handleQuickAction = (action: string) => {
    // This will be implemented to create new documents based on templates
    console.log(`Quick action: ${action}`);
  };

  const handleExport = () => {
    const content = window.localStorage.getItem("novel-content");
    const markdown = window.localStorage.getItem("markdown");
    
    if (markdown) {
      const blob = new Blob([markdown], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `alecia-document-${new Date().toISOString().split('T')[0]}.md`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <MenuIcon width={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="end">
        <div className="space-y-1">
          <p className="p-2 text-xs font-medium text-muted-foreground">Quick Actions</p>
          {quickActions.map(({ label, icon, action }) => (
            <Button
              key={action}
              variant="ghost"
              className="flex w-full items-center justify-start gap-2 px-2 py-1.5 text-sm"
              onClick={() => handleQuickAction(action)}
            >
              <div className="rounded-sm border p-1">{icon}</div>
              <span>{label}</span>
            </Button>
          ))}
        </div>

        <Separator className="my-2" />

        <div className="space-y-1">
          <Button
            variant="ghost"
            className="flex w-full items-center justify-start gap-2 px-2 py-1.5 text-sm"
            onClick={handleExport}
          >
            <div className="rounded-sm border p-1">
              <Download className="h-4 w-4" />
            </div>
            <span>Export as Markdown</span>
          </Button>
          <Button
            variant="ghost"
            className="flex w-full items-center justify-start gap-2 px-2 py-1.5 text-sm"
            disabled
          >
            <div className="rounded-sm border p-1">
              <Share2 className="h-4 w-4" />
            </div>
            <span>Share Document</span>
          </Button>
        </div>

        <Separator className="my-2" />

        <p className="p-2 text-xs font-medium text-muted-foreground">Appearance</p>
        {appearances.map(({ theme, icon }) => (
          <Button
            variant="ghost"
            key={theme}
            className="flex w-full items-center justify-between rounded px-2 py-1.5 text-sm"
            onClick={() => {
              setTheme(theme.toLowerCase());
            }}
          >
            <div className="flex items-center space-x-2">
              <div className="rounded-sm border p-1">{icon}</div>
              <span>{theme}</span>
            </div>
            {currentTheme === theme.toLowerCase() && <Check className="h-4 w-4" />}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
