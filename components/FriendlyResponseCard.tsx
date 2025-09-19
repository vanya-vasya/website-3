import React from "react";
import { cn } from "@/lib/utils";
import { Heart, Lightbulb, Target, Sparkles } from "lucide-react";
import { FriendlyResponse } from "@/lib/friendly-response-formatter";

interface FriendlyResponseCardProps {
  response: FriendlyResponse;
  gradient?: string;
  className?: string;
}

export function FriendlyResponseCard({ 
  response, 
  gradient = "from-emerald-400 via-green-500 to-teal-600",
  className 
}: FriendlyResponseCardProps) {
  return (
    <div className={cn(
      "mx-auto max-w-4xl rounded-2xl shadow-xl border-0 bg-white overflow-hidden",
      "transform transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]",
      className
    )}>
      {/* Header with emoji and greeting */}
      <div className={cn(
        "bg-gradient-to-r p-6 text-white relative overflow-hidden",
        `bg-gradient-to-r ${gradient}`
      )}>
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 text-6xl">{response.emoji}</div>
          <div className="absolute bottom-2 left-4 h-8 w-8 rounded-full bg-white opacity-20"></div>
          <div className="absolute top-8 left-20 h-4 w-4 rounded-full bg-white opacity-20"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="h-6 w-6" />
            <h2 className="text-2xl font-bold tracking-tight">Master Nutritionist</h2>
          </div>
          
          <p className="text-lg text-white/90 leading-relaxed">{response.greeting}</p>
        </div>
      </div>

      {/* Main content */}
      <div className="p-8 space-y-6">
        {/* Main message */}
        {response.mainContent && (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-6 border border-emerald-200">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-emerald-600 mt-1 flex-shrink-0" />
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {response.mainContent}
              </div>
            </div>
          </div>
        )}
        
        {/* Action items with enhanced header */}
        {response.actionItems.length > 0 && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 rounded-lg">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <Target className="h-6 w-6" />
                🎯 Your Nutrition Blueprint
              </h3>
              <p className="text-emerald-100 text-sm mt-1">Simple steps to transform your health</p>
            </div>
            
            <div className="space-y-3">
              {response.actionItems.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-4 p-5 bg-white rounded-xl border-l-4 border-emerald-500 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.01]"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">{index + 1}</span>
                  </div>
                  <div className="text-gray-700 leading-relaxed flex-1">
                    <div dangerouslySetInnerHTML={{ 
                      __html: item
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-emerald-700">$1</strong>')
                        .replace(/^[^:]+:/, '<span class="text-emerald-800 font-semibold">$&</span>')
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Next steps with enhanced styling */}
        {response.nextSteps && (
          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-xl p-6 border-l-4 border-amber-400 shadow-sm">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 -mx-6 -mt-6 mb-4 p-4 rounded-t-xl">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <Lightbulb className="h-6 w-6" />
                🚀 Next Steps
              </h3>
              <p className="text-amber-100 text-sm mt-1">Ready to take action?</p>
            </div>
            <div className="text-amber-800 leading-relaxed text-lg font-medium">
              {response.nextSteps}
            </div>
          </div>
        )}
        
        {/* Encouragement with enhanced styling */}
        <div className="text-center p-8 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-2xl border border-purple-200 shadow-sm">
          <div className="text-4xl mb-4 animate-bounce">{response.emoji}</div>
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            <p className="font-bold text-xl leading-relaxed mb-2">
              ✨ You've Got This! ✨
            </p>
          </div>
          <p className="text-purple-800 font-medium text-lg italic leading-relaxed">
            {response.encouragement}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 pb-6">
        <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-4">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            <span>Generated with care by Master Nutritionist AI</span>
          </div>
          <div className="text-xs">
            Personalized nutrition guidance
          </div>
        </div>
      </div>
    </div>
  );
}
