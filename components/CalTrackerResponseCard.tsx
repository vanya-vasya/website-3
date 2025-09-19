import React from "react";
import { cn } from "@/lib/utils";
import { Target, Activity, TrendingUp, Lightbulb, Sparkles, Heart } from "lucide-react";
import { CalTrackerResponse } from "@/lib/cal-tracker-formatter";

interface CalTrackerResponseCardProps {
  response: CalTrackerResponse;
  gradient?: string;
  className?: string;
}

export function CalTrackerResponseCard({ 
  response, 
  gradient = "from-blue-400 via-cyan-500 to-indigo-600",
  className 
}: CalTrackerResponseCardProps) {
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
            <Target className="h-6 w-6" />
            <h2 className="text-2xl font-bold tracking-tight">Cal Tracker Analysis</h2>
          </div>
          
          <p className="text-lg text-white/90 leading-relaxed">{response.greeting}</p>
        </div>
      </div>

      {/* Main content */}
      <div className="p-8 space-y-6">
        
        {/* Nutrition Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-start gap-3">
            <Activity className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              <div dangerouslySetInnerHTML={{ 
                __html: response.nutritionSummary
                  .replace(/\n/g, '<br>')
                  .replace(/(calories|protein|fat|carb)/gi, '<strong class="text-blue-700">$&</strong>')
              }} />
            </div>
          </div>
        </div>

        {/* Calorie Breakdown */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            🔥 Nutritional Breakdown
          </h3>
          
          {/* Total Calories Display */}
          <div className="text-center p-4 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg border border-orange-200">
            <div className="text-3xl font-bold text-orange-600">{response.calorieBreakdown.totalCalories}</div>
            <div className="text-sm text-orange-700 mt-1">Total Energy Content</div>
          </div>
          
          {/* Macros Grid */}
          {response.calorieBreakdown.macros.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {response.calorieBreakdown.macros.map((macro, index) => (
                <div 
                  key={index}
                  className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{macro.emoji}</span>
                    <span className="font-semibold text-gray-700">{macro.name}</span>
                  </div>
                  <div className="text-xl font-bold text-blue-600">{macro.value}</div>
                  <div className="text-sm text-gray-500">{macro.percentage} of macros</div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Health Insights */}
        {response.healthInsights.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              💡 Smart Nutrition Insights
            </h3>
            
            <div className="space-y-3">
              {response.healthInsights.map((insight, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200 shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-semibold text-sm">{index + 1}</span>
                  </div>
                  <div className="text-green-800 leading-relaxed flex-1">
                    <div dangerouslySetInnerHTML={{ 
                      __html: insight
                        .replace(/\*\*/g, '')
                        .replace(/\*/g, '')
                        .replace(/—/g, '-')
                        .replace(/#/g, '')
                        .replace(/(protein|muscle|energy|nutrition|calories)/gi, '<strong class="text-green-700">$1</strong>')
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Recommendations */}
        {response.recommendations.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-600" />
              🎯 Personalized Recommendations
            </h3>
            
            <div className="space-y-3">
              {response.recommendations.map((recommendation, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200 shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-600 font-semibold text-sm">{index + 1}</span>
                  </div>
                  <div className="text-amber-800 leading-relaxed flex-1">
                    <div dangerouslySetInnerHTML={{ 
                      __html: recommendation
                        .replace(/\*\*/g, '')
                        .replace(/\*/g, '')
                        .replace(/—/g, '-')
                        .replace(/#/g, '')
                        .replace(/(morning|workout|protein|pairing|portions|timing)/gi, '<strong class="text-amber-700">$1</strong>')
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Next Steps */}
        {response.nextSteps && (
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-800 mb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              What's Next?
            </h3>
            <div className="text-purple-700 leading-relaxed" dangerouslySetInnerHTML={{ 
              __html: response.nextSteps
                ?.replace(/\*\*/g, '')
                .replace(/\*/g, '')
                .replace(/—/g, '-')
                .replace(/#/g, '')
                .replace(/(nutrition|health|energy|tracking|analysis)/gi, '<strong class="text-purple-700">$&</strong>')
              || ''
            }} />
          </div>
        )}
        
        {/* Encouragement */}
        <div className="text-center p-6 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg border border-pink-200">
          <div className="text-2xl mb-2">{response.emoji}</div>
          <p className="text-pink-800 font-medium text-lg italic leading-relaxed">
            {response.encouragement}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 pb-6">
        <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-4">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span>Powered by Cal Tracker AI Intelligence</span>
          </div>
          <div className="text-xs">
            Smart nutrition analysis for better health
          </div>
        </div>
      </div>
    </div>
  );
}
