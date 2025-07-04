"use client";

import {
  ArrowRight,
  Sparkles,
  Zap,
  VideoIcon,
  PenTool,
  Music,
  Paintbrush,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { tools, professions, Profession } from "@/constants";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const item = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

// Function to get the border color from a text color class
const getBorderColorFromTextColor = (colorClass: string) => {
  // Extract color name and variant from format like "text-violet-600"
  const parts = colorClass.split("-");
  if (parts.length >= 3) {
    const colorName = parts[1];
    return `border-${colorName}-400/30`;
  }
  return "border-gray-400/30"; // fallback
};

export default function HomePage() {
  const router = useRouter();
  const [activeFilters, setActiveFilters] = useState<Profession[]>([]);
  const [filteredTools, setFilteredTools] = useState(tools);

  useEffect(() => {
    if (activeFilters.length === 0) {
      // Когда фильтры не выбраны, показываем все профессиональные инструменты, исключая базовые
      setFilteredTools(
        tools.filter((tool) => !tool.professions.includes("all"))
      );
    } else {
      // Показываем инструменты, соответствующие выбранным фильтрам
      setFilteredTools(
        tools.filter((tool) =>
          activeFilters.some((filter) => tool.professions.includes(filter))
        )
      );
    }
  }, [activeFilters]);

  const toggleFilter = (profession: Profession) => {
    setActiveFilters((prev) => {
      // Если фильтр уже активен, удаляем его
      if (prev.includes(profession)) {
        return prev.filter((p) => p !== profession);
      }
      // Иначе добавляем его
      return [...prev, profession];
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-6 relative">
        <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-br from-indigo-800/20 via-purple-700/10 to-transparent rounded-3xl blur-3xl -z-10"></div>

        <h1 className="text-4xl md:text-6xl font-heading font-bold text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 inline">
            Creator Studio
          </span>
        </h1>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 bg-indigo-900/20 backdrop-blur-sm border border-indigo-500/10 py-3 px-5 rounded-full mb-4">
            <Zap className="h-4 w-4 text-indigo-400" />
            <p className="text-sm text-indigo-300">
              Elevate your creative content with AI
            </p>
          </div>
          <p className="text-center text-muted-foreground max-w-[700px] mx-auto text-base md:text-lg">
            Powerful AI tools designed specifically for content creators, video
            artists, photographers and digital artists.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {professions.map((profession) => (
            <button
              key={profession.id}
              onClick={() => toggleFilter(profession.id as Profession)}
              className={cn(
                "flex items-center gap-2 py-2 px-4 rounded-lg transition-all duration-300",
                profession.bgColor,
                profession.borderColor,
                "border",
                // Если фильтр активен, добавляем эффект свечения
                activeFilters.includes(profession.id as Profession) &&
                  "ring-2 ring-offset-2 ring-offset-gray-900 shadow-lg",
                activeFilters.includes(profession.id as Profession)
                  ? `ring-${profession.textColor.split("-")[1]}`
                  : ""
              )}
            >
              <profession.icon
                className={cn("h-5 w-5", profession.iconColor)}
              />
              <span className={cn("text-sm font-medium", profession.textColor)}>
                {profession.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4"
        >
          {filteredTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              variants={item}
              initial="hidden"
              animate="show"
              exit="hidden"
              layout
              className="w-full"
            >
              <Card
                onClick={() => router.push(`${tool.href}?toolId=${tool.id}`)}
                className="group relative overflow-hidden p-6 hover:shadow-xl transition-all duration-500 cursor-pointer border-0 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl glow-card"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-5">
                    <div
                      className={cn(
                        "p-3 rounded-xl backdrop-blur-sm border icon-float",
                        tool.bgColor,
                        getBorderColorFromTextColor(tool.color),
                        `${tool.id}-icon`
                      )}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <tool.icon className={cn("w-6 h-6", tool.color)} />
                    </div>
                    <h3 className="font-heading font-semibold text-lg text-white">
                      {tool.label}
                    </h3>
                  </div>

                  <p className="text-sm text-gray-300 mb-6 line-clamp-2">
                    {tool.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="h-3 w-3" />
                        {tool.professions.includes("all")
                          ? "Creator Tool"
                          : tool.professions.includes("video")
                          ? "Video Creator"
                          : tool.professions.includes("art")
                          ? "Digital Artist"
                          : tool.professions.includes("music")
                          ? "Musician"
                          : "Content Creator"}
                      </span>
                    </span>
                    <div className="h-8 w-8 rounded-full flex items-center justify-center bg-indigo-500/10 group-hover:bg-indigo-500/30 transition-colors duration-300 btn-glow">
                      <ArrowRight className="w-4 h-4 text-indigo-300 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="relative py-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-indigo-500/10" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-4 py-1 text-xs text-indigo-300 rounded-full border border-indigo-500/10 backdrop-blur-sm">
            Made for creators, by creators
          </span>
        </div>
      </div>
    </div>
  );
}
