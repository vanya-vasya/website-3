import { Sparkles } from "lucide-react";

interface EmptyProps {
  label: string;
}

export const Empty = ({
  label
}: EmptyProps) => {
  return (
    <div className="h-full p-20 flex flex-col items-center justify-center">
      <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-indigo-600/20 to-purple-600/20 animate-pulse">
        <Sparkles className="w-8 h-8 text-indigo-400" />
      </div>
      <p className="text-lg font-medium bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent text-center">
        {label}
      </p>
    </div>
  );
};