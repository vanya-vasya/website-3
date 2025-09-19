import Image from "next/image";
import { Hourglass } from "lucide-react";

export const Loader = () => {
  return (
    <div className="h-full flex flex-col gap-y-4 items-center justify-center bg-slate-900">
      {/* Yum-mi Logo */}
      <div className="w-12 h-12 relative mb-2">
        <Image
          alt="Yum-mi Logo"
          src="/logos/yum-mi-onigiri-logo.png"
          fill
          className="object-contain"
        />
      </div>
      
      {/* Rotating Hourglass Icon */}
      <div className="relative">
        <Hourglass 
          className="w-8 h-8 text-amber-500 animate-spin" 
          style={{
            animation: 'spin 2s linear infinite'
          }}
        />
        {/* Glow effect */}
        <div className="absolute inset-0 w-8 h-8 bg-amber-500/20 rounded-full blur-md animate-pulse"></div>
      </div>
      
      {/* Loading text */}
      <p className="text-sm text-muted-foreground animate-pulse">
        Yum-mi is thinking...
      </p>
      
      {/* Loading dots animation */}
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};
};