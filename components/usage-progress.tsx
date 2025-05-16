"use client"

import * as React from "react"
import { Progress } from "@/components/ui/progress"
import { useProModal } from "@/hooks/use-pro-modal"

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
    <div className="flex flex-col gap-2 cursor-pointer" onClick={proModal.onOpen}>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{usedGenerations}/{availableGenerations} generations</span>
        <span>{Math.round(usagePercentage) || 0}%</span>
      </div>
      <Progress 
        value={usagePercentage} 
        className="h-2"
      />
    </div>
  )
} 