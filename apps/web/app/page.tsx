import TailwindAdvancedEditor from "@/components/tailwind/advanced-editor";
import DealPipeline from "@/components/deal-pipeline";
import { Button } from "@/components/tailwind/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/tailwind/ui/dialog";
import Menu from "@/components/tailwind/ui/menu";
import { ScrollArea } from "@/components/tailwind/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tailwind/ui/tabs";
import { BookOpen, Briefcase, FileText } from "lucide-react";
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center gap-4 py-4 sm:px-5">
      <div className="flex w-full max-w-screen-lg items-center gap-2 px-4 sm:mb-[calc(10vh)]">
        <div className="flex items-center gap-2 mr-4">
          <Briefcase className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold">Alecia Colab</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2" variant="outline">
              <BookOpen className="h-4 w-4" />
              Quick Note
            </Button>
          </DialogTrigger>
          <DialogContent className="flex max-w-3xl h-[calc(100vh-24px)]">
            <ScrollArea className="max-h-screen">
              <TailwindAdvancedEditor />
            </ScrollArea>
          </DialogContent>
        </Dialog>
        <Menu />
        <div className="ml-auto flex items-center gap-2">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="default">Sign In</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>

      <div className="w-full max-w-screen-lg px-4">
        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="editor" className="gap-2">
              <FileText className="h-4 w-4" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="pipeline" className="gap-2">
              <Briefcase className="h-4 w-4" />
              Deal Pipeline
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor" className="mt-6">
            <TailwindAdvancedEditor />
          </TabsContent>
          
          <TabsContent value="pipeline" className="mt-6">
            <DealPipeline />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
