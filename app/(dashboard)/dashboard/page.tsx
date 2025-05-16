"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { tools } from "@/constants";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl md:text-5xl font-heading font-bold text-center">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 inline">Welcome to Neuvisia AI</span>
        </h1>
        <p className="text-center text-muted-foreground max-w-[600px] mx-auto">
          Explore our powerful AI tools to enhance your creativity and
          productivity.
        </p>
        <p className="
text-red-600 bg-red-600/10 text-orange-700 bg-orange-700/10 text-yellow-600 bg-yellow-600/10 text-lime-600 bg-lime-600/10 text-emerald-600 bg-emerald-600/10 text-cyan-600 bg-cyan-600/10 text-blue-600 bg-blue-600/10 text-indigo-600 bg-indigo-600/10 text-violet-500 bg-violet-500/10 text-fuchsia-600 bg-fuchsia-600/10 text-rose-600 bg-rose-600/10">
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4"
      >
        {tools.map((tool) => (
          <motion.div key={tool.href} variants={item}>
            <Card
              onClick={() => router.push(tool.href)}
              className="group relative overflow-hidden p-6 hover:shadow-lg transition-all duration-300 cursor-pointer bg-card hover:bg-accent/5"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className={cn("p-2.5 rounded-lg", tool.bgColor)}>
                    <tool.icon className={cn("w-6 h-6", tool.color)} />
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-muted-foreground">
                    {tool.label}
                  </h3>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  {tool.description ||
                    "Harness the power of AI to transform your work."}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-pink-600">
                    AI Powered
                  </span>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-pink-600 transition-colors" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-2 text-xs text-muted-foreground">
            Powered by advanced AI models
          </span>
        </div>
      </div>
    </div>
  );
}
