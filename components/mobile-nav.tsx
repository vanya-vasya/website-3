"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, Sparkles, X, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { UsageProgress } from "@/components/usage-progress"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet"
import { 
  MessageSquare, 
  Code, 
  Music, 
  Video, 
  ImageIcon, 
  Wand2,
  Eraser,
  Scissors,
  PaintBucket,
  Image as ImageRestore,
  Layers,
  Menu,
  LayoutDashboard
} from "lucide-react"
import { useProModal } from "@/hooks/use-pro-modal"
import Image from "next/image"

const aiTools = [
  {
    title: "Chat Assistant",
    href: "/dashboard/conversation",
    description: "Advanced AI chatbot for natural conversations",
    icon: MessageSquare,
  },
  {
    title: "Code Generation",
    href: "/dashboard/code",
    description: "Generate code snippets and solutions",
    icon: Code,
  },
]

const creativeGenerators = [
  {
    title: "Image Generation",
    href: "/dashboard/image-generation",
    description: "Create images from text descriptions",
    icon: ImageIcon,
  },
  {
    title: "Music Generation",
    href: "/dashboard/music",
    description: "Create original music and audio",
    icon: Music,
  },
  {
    title: "Speech Generation",
    href: "/dashboard/speech",
    description: "Convert text to natural speech",
    icon: MessageSquare,
  },
  {
    title: "Video Generation",
    href: "/dashboard/video",
    description: "Generate and edit video content",
    icon: Video,
  },
]

const imageTools = [
  {
    title: "Image Restore",
    href: "/dashboard/image-restore",
    description: "Enhance and restore old images",
    icon: ImageRestore,
  },
  {
    title: "Image Background Removal",
    href: "/dashboard/image-background-removal",
    description: "Remove image backgrounds automatically",
    icon: Eraser,
  },
  {
    title: "Image Generative Fill",
    href: "/dashboard/image-generative-fill",
    description: "Fill empty spaces with AI-generated content",
    icon: Layers,
  },
  {
    title: "Image Object Recolor",
    href: "/dashboard/image-object-recolor",
    description: "Change colors of objects in images",
    icon: PaintBucket,
  },
  {
    title: "Image Object Remove",
    href: "/dashboard/image-object-remove",
    description: "Remove unwanted objects from images",
    icon: Scissors,
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    description: "Overview and quick access to all tools",
    icon: LayoutDashboard,
  },
]

export function MobileNav({ initialUsedGenerations, initialAvailableGenerations }: { initialUsedGenerations: number, initialAvailableGenerations: number }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [aiToolsOpen, setAiToolsOpen] = React.useState(false)
  const [mediaToolsOpen, setMediaToolsOpen] = React.useState(false)
  const [imageToolsOpen, setImageToolsOpen] = React.useState(false)
  const pathname = usePathname()

  const proModal = useProModal();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden hover:bg-accent"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="w-[280px] p-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <SheetHeader className="p-4 border-b">
          <Image src="/logo.png" alt="Neuvisia Logo" width={150} height={50} />
        </SheetHeader>

        <div className="flex flex-col h-[calc(100vh-4rem)]">
          <div className="flex-1 overflow-y-auto">
            <Collapsible
              open={aiToolsOpen}
              onOpenChange={setAiToolsOpen}
              className="border-b"
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between p-4 font-medium hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-2">
                  <Wand2 className="h-4 w-4" />
                  AI Tools
                </div>
                <ChevronRight 
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    aiToolsOpen && "rotate-90"
                  )} 
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 p-2">
                {aiTools.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent/50 transition-colors",
                      pathname === item.href ? "bg-accent/50" : "text-muted-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                ))}
              </CollapsibleContent>
            </Collapsible>

            <Collapsible
              open={mediaToolsOpen}
              onOpenChange={setMediaToolsOpen}
              className="border-b"
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between p-4 font-medium hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                  Creative Generators
                </div>
                <ChevronRight 
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    mediaToolsOpen && "rotate-90"
                  )} 
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 p-2">
                {creativeGenerators.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent/50 transition-colors",
                      pathname === item.href ? "bg-accent/50" : "text-muted-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                ))}
              </CollapsibleContent>
            </Collapsible>


            
            <Collapsible
              open={imageToolsOpen}
              onOpenChange={setImageToolsOpen}
              className="border-b"
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between p-4 font-medium hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Image Tools
                </div>
                <ChevronRight 
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    imageToolsOpen && "rotate-90"
                  )} 
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 p-2">
                {imageTools.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent/50 transition-colors",
                      pathname === item.href ? "bg-accent/50" : "text-muted-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                ))}
              </CollapsibleContent>
            </Collapsible>

            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center gap-2 p-4 font-medium hover:bg-accent/50 transition-colors border-b"
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          </div>

          <div className="p-4 border-t">
            <UsageProgress 
              initialUsedGenerations={initialUsedGenerations}
              initialAvailableGenerations={initialAvailableGenerations}
            />
          </div>
          <div 
            className={cn(
              "flex items-center gap-2 p-4 font-medium transition-all duration-300",
              "bg-gradient-to-r from-violet-600/20 via-pink-600/20 to-blue-600/20",
              "hover:from-violet-600/30 hover:via-pink-600/30 hover:to-blue-600/30",
              "border-t border-violet-600/20",
              "text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400",
              "cursor-pointer"
            )}
            onClick={proModal.onOpen}
            role="button"
          >
            <Zap className="h-4 w-4 text-pink-500 animate-pulse" />
            <span className="font-bold">Buy More Generations</span>
            <div className="ml-auto flex items-center">
              <span className="text-sm bg-gradient-to-r from-violet-400 to-pink-400 text-white px-2 py-0.5 rounded-full">
                Premium
              </span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
} 