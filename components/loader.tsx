import { Hourglass } from "lucide-react";

export const Loader = () => {
  return (
    <div className="h-full flex items-center justify-center">
      {/* Rotating Hourglass Icon */}
      <Hourglass 
        className="w-8 h-8 text-amber-500 animate-spin" 
        style={{
          animation: 'spin 2s linear infinite'
        }}
      />
    </div>
  );
};