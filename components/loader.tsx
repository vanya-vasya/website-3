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
      <div className="flex items-center justify-center">
        <Hourglass 
          className="w-8 h-8 text-amber-500 animate-spin" 
          style={{
            animation: 'spin 2s linear infinite'
          }}
        />
      </div>
      
      {/* Loading text */}
      <p className="text-sm text-muted-foreground">
        Yum-mi is thinking...
      </p>
    </div>
  );
};