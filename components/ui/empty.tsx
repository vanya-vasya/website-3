interface EmptyProps {
  label: string;
  gradient?: string;
}

export const Empty = ({
  label,
  gradient = "from-cyan-400 via-blue-500 to-indigo-600"
}: EmptyProps) => {
  return (
    <div className="h-full p-20 flex flex-col items-center justify-center">
      <p className={`text-lg font-medium bg-gradient-to-r ${gradient} bg-clip-text text-transparent text-center`}>
        {label}
      </p>
    </div>
  );
};