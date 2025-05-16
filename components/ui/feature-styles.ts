export const inputStyles = {
  base: "border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent",
  container: "rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-lg transition bg-background",
};

export const buttonStyles = {
  base: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
};

export const cardStyles = {
  base: "rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-all duration-300",
  interactive: "cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
};

export const contentStyles = {
  base: "px-4 lg:px-8 space-y-4",
  section: "space-y-4 mt-4",
};

export const messageStyles = {
  container: "p-4 lg:p-8 w-full flex items-start gap-x-4 lg:gap-x-8 rounded-lg",
  user: "bg-accent",
  assistant: "bg-accent/50",
};

export const loadingStyles = {
  container: "p-8 rounded-lg w-full flex items-center justify-center bg-accent/50",
}; 