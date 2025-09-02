"use client";

import {
  Sparkles,
  Zap,
  Crown,
  Users,
  Calculator,
  Target,
  TrendingUp,
  Activity,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

const nutritionTools = [
  {
    id: "master-chef",
    label: "Master Chef",
    icon: Crown,
    description: "Your personal nutrition coach providing expert meal planning, dietary analysis, and personalized nutrition strategies for optimal health",
    href: "/dashboard/conversation",
    color: "from-amber-400 via-orange-500 to-red-600",
    bgGradient: "from-amber-400/10 via-orange-500/10 to-red-600/10",
    iconGradient: "from-amber-400 via-orange-500 to-red-600",
    badge: "Advanced Analytics"
  },
  {
    id: "master-nutritionist",
    label: "Master Nutritionist",
    icon: Activity,
    description: "Advanced nutritional analysis and meal optimization with scientific precision, macro tracking, and health goal alignment",
    href: "/dashboard/conversation",
    color: "from-emerald-400 via-green-500 to-teal-600",
    bgGradient: "from-emerald-400/10 via-green-500/10 to-teal-600/10",
    iconGradient: "from-emerald-400 via-green-500 to-teal-600",
    badge: "Nutrition Expert"
  },
  {
    id: "cal-tracker",
    label: "Cal Tracker",
    icon: Target,
    description: "Intelligent calorie and nutrient tracking with real-time insights, progress monitoring, and personalized recommendations",
    href: "/dashboard/conversation",
    color: "from-blue-400 via-cyan-500 to-indigo-600",
    bgGradient: "from-blue-400/10 via-cyan-500/10 to-indigo-600/10",
    iconGradient: "from-blue-400 via-cyan-500 to-indigo-600",
    badge: "Smart Tracking"
  }
];

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="space-y-12 bg-white">
      {/* Header Section */}
      <div className="space-y-6 relative max-w-[1350px] mx-auto bg-white">
        <h1 className="text-4xl md:text-6xl font-bold text-center">
          <span 
            className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-green-500 to-green-600 inline"
            style={{
              fontFamily: 'var(--contact-font)',
              fontWeight: 600,
              letterSpacing: '0.01em',
              textTransform: 'none'
            }}
          >
            MINDFUL EATER
          </span>
        </h1>

        <div className="flex justify-center mb-12">
          <p 
            className="max-w-4xl text-base text-center"
            style={{
              fontFamily: 'var(--contact-font)',
              fontWeight: 600,
              letterSpacing: '0.01em',
              textTransform: 'none',
              color: '#0f172a'
            }}
          >
            Smart AI tools to analyze your meals, track nutrition, and guide your journey toward healthier eating habits
          </p>
        </div>
      </div>

      {/* Cards Matrix */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {nutritionTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              variants={item}
              className="flex"
            >
              <Card
                onClick={() => router.push(`${tool.href}?toolId=${tool.id}`)}
                className="group relative overflow-hidden p-6 shadow-lg shadow-indigo-500/20 hover:shadow-2xl hover:shadow-indigo-500/40 transition-all duration-500 cursor-pointer border-0 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl glow-card h-full transform hover:scale-[1.02] hover:-translate-y-2 w-full"
                style={{
                  boxShadow: '0 0 0 1px rgba(129, 140, 248, 0.3), 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
              >
                {/* Multi-layer glow effects with pulsing animation */}
                <div
                  className={`absolute inset-0 rounded-xl bg-gradient-to-r ${tool.iconGradient} opacity-0 group-hover:opacity-30 blur-md transition-all duration-500 z-10 glow-pulse`}
                ></div>
                
                {/* Secondary glow layer */}
                <div
                  className={`absolute inset-0 rounded-xl bg-gradient-to-br ${tool.iconGradient} opacity-0 group-hover:opacity-15 blur-xl transition-all duration-700 z-10`}
                ></div>

                {/* Animated gradient overlay with shimmer */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-15 shimmer-effect"></div>

                {/* Enhanced progress bar */}
                <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${tool.iconGradient} transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500`}></div>
                
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>

                <div className="relative z-20 flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <div
                        className={`absolute inset-0 rounded-full bg-gradient-to-r ${tool.iconGradient} opacity-20 blur-lg`}
                      ></div>
                      <div className={`relative bg-gradient-to-r ${tool.iconGradient} p-3 rounded-full backdrop-blur-sm`}>
                        <tool.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h3 className={`font-heading font-semibold text-lg bg-clip-text text-transparent bg-gradient-to-r ${tool.iconGradient} transition-all duration-500`}>
                      {tool.label}
                    </h3>
                  </div>

                  <p className="text-sm text-black mb-6 line-clamp-3 flex-grow transition-colors duration-500">
                    {tool.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium px-3 py-1.5 rounded-full bg-gradient-to-r ${tool.bgGradient} group-hover:opacity-80 text-black border border-indigo-500/20 group-hover:border-indigo-400/30 transition-all duration-500`}>
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="h-3 w-3 transition-transform duration-500 group-hover:rotate-180" />
                        {tool.badge}
                      </span>
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="relative py-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-indigo-500/10" />
        </div>
      </div>
      
      <style jsx global>{`
        :root {
          --contact-font: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
        
        .glow-pulse {
          animation: glow-pulse 2s ease-in-out infinite alternate;
        }
        
        @keyframes glow-pulse {
          from {
            opacity: 0;
          }
          to {
            opacity: 0.3;
          }
        }
        
        .shimmer-effect {
          background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
          background-size: 200% 200%;
          animation: shimmer 3s ease-in-out infinite;
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% -200%;
          }
          100% {
            background-position: 200% 200%;
          }
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
