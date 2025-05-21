"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, Sparkles, X, Zap, PenTool, Paintbrush } from "lucide-react"
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
  FileAudio, 
  FileVideo2, 
  FileImage, 
  Wand2,
  ImageMinus,
  Scissors,
  PaintBucket,
  ArchiveRestore,
  Layers,
  Menu,
  LayoutDashboard,
  BrushIcon
} from "lucide-react"
import { useProModal } from "@/hooks/use-pro-modal"
import Image from "next/image"
import { tools } from "@/constants"

// Инструменты для видео-креаторов
const videoCreatorTools = tools.filter(tool => tool.professions.includes('video'))

// Инструменты для цифровых художников
const digitalArtistTools = tools.filter(tool => tool.professions.includes('art'))

// Инструменты для музыкантов
const musicianTools = tools.filter(tool => tool.professions.includes('music'))

// Инструменты для контент-креаторов
const contentCreatorTools = tools.filter(tool => tool.professions.includes('content'))

// Общие инструменты
const commonTools = tools.filter(tool => tool.professions.includes('all'))

export function MobileNav({ initialUsedGenerations, initialAvailableGenerations }: { initialUsedGenerations: number, initialAvailableGenerations: number }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [videoToolsOpen, setVideoToolsOpen] = React.useState(false)
  const [artToolsOpen, setArtToolsOpen] = React.useState(false)
  const [musicToolsOpen, setMusicToolsOpen] = React.useState(false)
  const [contentToolsOpen, setContentToolsOpen] = React.useState(false)
  const pathname = usePathname()

  const proModal = useProModal();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden h-10 w-10 rounded-xl bg-indigo-900/20 hover:bg-indigo-900/40 border border-indigo-500/20 backdrop-blur-sm"
        >
          <Menu className="h-5 w-5 text-indigo-300" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="w-[300px] p-0 bg-gradient-to-b from-gray-900 to-black/95 backdrop-blur border-r border-indigo-500/20"
      >
        <SheetHeader className="p-5 border-b border-indigo-500/10">
          <div className="flex justify-between items-center">
            <Image src="/logo.png" alt="Neuvisia Logo" width={150} height={50} />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 rounded-full bg-indigo-900/20 hover:bg-indigo-900/40"
            >
              <X className="h-4 w-4 text-indigo-300" />
            </Button>
          </div>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100vh-4rem)]">
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <div className="mb-6">
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl p-3 mb-2 transition-colors bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/10",
                    pathname === "/dashboard" && "bg-indigo-500/20 border-indigo-500/30"
                  )}
                >
                  <div className="h-8 w-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                    <LayoutDashboard className="h-4 w-4 text-indigo-300" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Creator Studio</p>
                    <p className="text-xs text-indigo-300">All creative tools</p>
                  </div>
                </Link>
              </div>
              
              <div className="w-full mb-4">
                <UsageProgress 
                  initialUsedGenerations={initialUsedGenerations}
                  initialAvailableGenerations={initialAvailableGenerations}
                />
              </div>
            </div>
            
            <Collapsible
              open={videoToolsOpen}
              onOpenChange={setVideoToolsOpen}
              className="border-y border-indigo-500/10"
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between p-4 font-medium text-white hover:bg-violet-900/30 transition-colors">
                <div className="flex items-center gap-2">
                  <FileVideo2 className="h-4 w-4 text-violet-400" />
                  Video Creators
                </div>
                <ChevronRight 
                  className={cn(
                    "h-4 w-4 transition-transform duration-200 text-violet-400",
                    videoToolsOpen && "rotate-90"
                  )} 
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 p-2 bg-violet-950/20">
                {videoCreatorTools.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-violet-900/30 transition-colors",
                      pathname === item.href ? "bg-violet-900/40 text-white" : "text-gray-300"
                    )}
                  >
                    <div className="h-7 w-7 rounded-md bg-violet-500/10 flex items-center justify-center">
                      <item.icon className="h-4 w-4 text-violet-300" />
                    </div>
                    {item.label}
                  </Link>
                ))}
              </CollapsibleContent>
            </Collapsible>

            <Collapsible
              open={artToolsOpen}
              onOpenChange={setArtToolsOpen}
              className="border-b border-indigo-500/10"
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between p-4 font-medium text-white hover:bg-pink-900/30 transition-colors">
                <div className="flex items-center gap-2">
                  <BrushIcon className="h-4 w-4 text-pink-400" />
                  Digital Artists
                </div>
                <ChevronRight 
                  className={cn(
                    "h-4 w-4 transition-transform duration-200 text-pink-400",
                    artToolsOpen && "rotate-90"
                  )} 
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 p-2 bg-pink-950/20">
                {digitalArtistTools.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-pink-900/30 transition-colors",
                      pathname === item.href ? "bg-pink-900/40 text-white" : "text-gray-300"
                    )}
                  >
                    <div className="h-7 w-7 rounded-md bg-pink-500/10 flex items-center justify-center">
                      <item.icon className="h-4 w-4 text-pink-300" />
                    </div>
                    {item.label}
                  </Link>
                ))}
              </CollapsibleContent>
            </Collapsible>

            <Collapsible
              open={musicToolsOpen}
              onOpenChange={setMusicToolsOpen}
              className="border-b border-indigo-500/10"
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between p-4 font-medium text-white hover:bg-blue-900/30 transition-colors">
                <div className="flex items-center gap-2">
                  <FileAudio className="h-4 w-4 text-blue-400" />
                  Musicians
                </div>
                <ChevronRight 
                  className={cn(
                    "h-4 w-4 transition-transform duration-200 text-blue-400",
                    musicToolsOpen && "rotate-90"
                  )} 
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 p-2 bg-blue-950/20">
                {musicianTools.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-blue-900/30 transition-colors",
                      pathname === item.href ? "bg-blue-900/40 text-white" : "text-gray-300"
                    )}
                  >
                    <div className="h-7 w-7 rounded-md bg-blue-500/10 flex items-center justify-center">
                      <item.icon className="h-4 w-4 text-blue-300" />
                    </div>
                    {item.label}
                  </Link>
                ))}
              </CollapsibleContent>
            </Collapsible>

            <Collapsible
              open={contentToolsOpen}
              onOpenChange={setContentToolsOpen}
              className="border-b border-indigo-500/10"
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between p-4 font-medium text-white hover:bg-emerald-900/30 transition-colors">
                <div className="flex items-center gap-2">
                  <PaintBucket className="h-4 w-4 text-emerald-400" />
                  Content Creators
                </div>
                <ChevronRight 
                  className={cn(
                    "h-4 w-4 transition-transform duration-200 text-emerald-400",
                    contentToolsOpen && "rotate-90"
                  )} 
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 p-2 bg-emerald-950/20">
                {contentCreatorTools.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-emerald-900/30 transition-colors",
                      pathname === item.href ? "bg-emerald-900/40 text-white" : "text-gray-300"
                    )}
                  >
                    <div className="h-7 w-7 rounded-md bg-emerald-500/10 flex items-center justify-center">
                      <item.icon className="h-4 w-4 text-emerald-300" />
                    </div>
                    {item.label}
                  </Link>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </div>
          
          <div className="p-4 border-t border-indigo-500/10">
            <div 
              className="rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 p-4 cursor-pointer"
              onClick={() => {
                proModal.onOpen();
                setIsOpen(false);
              }}
            >
              <div className="flex items-center gap-2 text-indigo-300 mb-2">
                <Zap className="h-4 w-4" />
                <p className="text-sm font-medium">Creator Pro Plan</p>
              </div>
              <p className="text-xs text-gray-400">Unlimited access to all creative tools and priority rendering</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
} 