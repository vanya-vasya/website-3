"use client"

import * as React from "react"
import { Progress } from "@/components/ui/progress"
import { useProModal } from "@/hooks/use-pro-modal"
import { Sparkles } from "lucide-react"

interface UsageProgressProps {
  initialUsedGenerations: number
  initialAvailableGenerations: number
}

export function UsageProgress({
  initialUsedGenerations,
  initialAvailableGenerations
}: UsageProgressProps) {
  const [usedGenerations, setUsedGenerations] = React.useState<number>(initialUsedGenerations)
  const [availableGenerations, setAvailableGenerations] = React.useState<number>(initialAvailableGenerations)

  const usagePercentage = (usedGenerations / availableGenerations) * 100
  const proModal = useProModal(); 
  
  return (
    <div 
      className="flex flex-col gap-2 cursor-pointer p-3 rounded-xl bg-indigo-900/20 border border-indigo-500/20 backdrop-blur-sm transition-all duration-300 hover:bg-indigo-900/30 group" 
      onClick={proModal.onOpen}
    >
      <div className="flex items-center justify-between text-xs text-indigo-300">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3 w-3" />
          <span className="font-medium">Credits</span>
        </div>
        <span className="font-bold text-indigo-200">
          {usedGenerations}/{availableGenerations}
        </span>
      </div>
      
      <div className="relative w-full h-2 rounded-full overflow-hidden bg-gray-800/60">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 group-hover:from-indigo-400 group-hover:to-purple-400"
          style={{ width: `${Math.min(usagePercentage, 100)}%` }}
        />
      </div>
      
      <div className="flex justify-between text-[10px] text-indigo-400/70">
        <span>{Math.round(usagePercentage) || 0}% Used</span>
        <span className="group-hover:text-indigo-300 transition-colors">Click to upgrade</span>
      </div>
    </div>
  )
} 