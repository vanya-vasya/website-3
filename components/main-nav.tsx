"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
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
  Sparkles
} from "lucide-react"
import Image from "next/image"
import { UsageProgress } from "./usage-progress"

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
]

export function MainNav({ initialUsedGenerations, initialAvailableGenerations }: { initialUsedGenerations: number, initialAvailableGenerations: number }) {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-6">
        <Link href="/dashboard" className="hidden items-center space-x-2 md:flex">
          <Image src="/logo.png" alt="Neuvisia Logo" width={150} height={50} />
        </Link>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <Wand2 className="mr-2 h-4 w-4" />
                AI Tools
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {aiTools.map((item) => (
                    <ListItem
                      key={item.title}
                      title={item.title}
                      href={item.href}
                      icon={item.icon}
                    >
                      {item.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <Sparkles className="mr-2 h-4 w-4" />
                Creative Generators
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {creativeGenerators.map((item) => (
                    <ListItem
                      key={item.title}
                      title={item.title}
                      href={item.href}
                      icon={item.icon}
                    >
                      {item.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <ImageIcon className="mr-2 h-4 w-4" />
                Image Tools
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {imageTools.map((item) => (
                    <ListItem
                      key={item.title}
                      title={item.title}
                      href={item.href}
                      icon={item.icon}
                    >
                      {item.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon: any }
>(({ className, title, children, icon: Icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2 text-sm font-medium leading-none">
            <Icon className="h-4 w-4" />
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem" 