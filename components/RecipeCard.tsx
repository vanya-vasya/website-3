import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Printer, ChefHat, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

type Recipe = {
  dish: string;
  kcal: number;
  prot: number;
  fat: number;
  carb: number;
  recipe: string; // markdown
};

interface RecipeCardProps {
  data: Recipe;
  gradient?: string;
  className?: string;
}

export function RecipeCard({ data, gradient = "from-amber-400 via-orange-500 to-red-600", className }: RecipeCardProps) {
  const macros = [
    { label: "kcal", value: data.kcal, icon: Activity, color: "text-red-600" },
    { label: "Protein", value: `${data.prot}g`, icon: Activity, color: "text-blue-600" },
    { label: "Fat", value: `${data.fat}g`, icon: Activity, color: "text-yellow-600" },
    { label: "Carbs", value: `${data.carb}g`, icon: Activity, color: "text-green-600" },
  ];

  const handleCopyRecipe = async () => {
    try {
      await navigator.clipboard.writeText(data.recipe);
      toast.success("Recipe copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy recipe");
    }
  };

  const handlePrint = () => {
    // Create a new window with just the recipe content
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${data.dish} - Recipe</title>
            <style>
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                line-height: 1.6;
              }
              h1 { color: #f59e0b; border-bottom: 2px solid #f59e0b; padding-bottom: 10px; }
              .macros { display: flex; gap: 15px; margin: 20px 0; }
              .macro { 
                padding: 8px 12px; 
                background: #f3f4f6; 
                border-radius: 8px; 
                font-size: 14px; 
                font-weight: 600;
              }
              .recipe-content { margin-top: 20px; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>
            <h1>${data.dish}</h1>
            <div class="macros">
              ${macros.map(m => `<div class="macro">${m.label}: ${m.value}</div>`).join('')}
            </div>
            <div class="recipe-content">${data.recipe.replace(/\n/g, '<br>')}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className={cn(
      "mx-auto max-w-4xl rounded-2xl shadow-xl border-0 bg-white overflow-hidden",
      "transform transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]",
      className
    )}>
      {/* Header with gradient background */}
      <div className={cn(
        "bg-gradient-to-r p-6 text-white relative overflow-hidden",
        gradient ? `bg-gradient-to-r ${gradient}` : "bg-gradient-to-r from-amber-400 via-orange-500 to-red-600"
      )}>
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10">
          <ChefHat className="absolute top-4 right-4 h-16 w-16" />
          <div className="absolute bottom-2 left-4 h-8 w-8 rounded-full bg-white opacity-20"></div>
          <div className="absolute top-8 left-20 h-4 w-4 rounded-full bg-white opacity-20"></div>
        </div>
        
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ChefHat className="h-8 w-8" />
            <h1 className="text-3xl font-bold tracking-tight">{data.dish}</h1>
          </div>
          
          {/* Master Chef badge */}
          <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
            Master Chef Recipe
          </div>
        </div>

        {/* Macros in header */}
        <div className="mt-6 flex flex-wrap gap-3 relative z-10">
          {macros.map((macro, index) => (
            <div 
              key={macro.label}
              className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-sm font-medium"
            >
              <macro.icon className="h-4 w-4" />
              <span className="opacity-90">{macro.label}:</span>
              <span className="font-bold text-lg">{macro.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recipe content */}
      <div className="p-8">
        <div className="prose prose-lg prose-neutral max-w-none">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold text-gray-900 border-b-2 border-amber-200 pb-2 mb-4">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3 flex items-center gap-2">
                  <ChefHat className="h-5 w-5 text-amber-600" />
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                  {children}
                </h3>
              ),
              ul: ({ children }) => (
                <ul className="space-y-2 my-4">{children}</ul>
              ),
              li: ({ children }) => (
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0"></span>
                  <span>{children}</span>
                </li>
              ),
              strong: ({ children }) => (
                <strong className="font-bold text-amber-700">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="italic text-gray-700">{children}</em>
              ),
              p: ({ children }) => (
                <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-amber-300 pl-4 py-2 bg-amber-50 rounded-r-lg my-4">
                  <div className="text-amber-800 italic">{children}</div>
                </blockquote>
              )
            }}
          >
            {data.recipe}
          </ReactMarkdown>
        </div>

        {/* Action buttons */}
        <div className="mt-8 flex gap-3 pt-6 border-t border-gray-100">
          <button
            onClick={handleCopyRecipe}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium",
              "border-2 border-amber-200 text-amber-700 hover:bg-amber-50",
              "transition-all duration-200 hover:scale-105 active:scale-95",
              "focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            )}
          >
            <Copy className="h-4 w-4" />
            Copy Recipe
          </button>
          
          <button
            onClick={handlePrint}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium",
              "border-2 border-gray-200 text-gray-700 hover:bg-gray-50",
              "transition-all duration-200 hover:scale-105 active:scale-95",
              "focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            )}
          >
            <Printer className="h-4 w-4" />
            Print Recipe
          </button>

          <div className="ml-auto flex items-center gap-2 text-sm text-gray-500">
            <ChefHat className="h-4 w-4" />
            <span>Generated by Master Chef AI</span>
          </div>
        </div>
      </div>
    </div>
  );
}
