"use client";

import { cn } from "@/lib/utils";
import { Model } from "@/lib/types";

interface ModelBadgeProps {
  model: Model;
  active?: boolean;
  onClick?: () => void;
}

export function ModelBadge({ model, active, onClick }: ModelBadgeProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all",
        "border border-border",
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-muted text-muted-foreground hover:text-foreground hover:bg-accent"
      )}
    >
      <span className={cn("size-2 rounded-full", model.color)} />
      {model.name}
    </button>
  );
}
