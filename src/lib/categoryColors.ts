import type { Category } from "./scoring";

export const CATEGORY_COLOR: Record<Category, string> = {
  Execution: "var(--pi-red)",
  Influence: "var(--pi-yellow)",
  Resilience: "var(--pi-green)",
  Knowledge: "var(--pi-blue)",
};

export const CATEGORY_HEX: Record<Category, string> = {
  Execution: "#e8503a",
  Influence: "#f4b740",
  Resilience: "#3f9e6d",
  Knowledge: "#3a7ce8",
};

export const CATEGORY_TEXT_CLASS: Record<Category, string> = {
  Execution: "text-pi-red",
  Influence: "text-pi-yellow",
  Resilience: "text-pi-green",
  Knowledge: "text-pi-blue",
};

export const CATEGORY_BG_CLASS: Record<Category, string> = {
  Execution: "bg-pi-red",
  Influence: "bg-pi-yellow",
  Resilience: "bg-pi-green",
  Knowledge: "bg-pi-blue",
};

const TIER_OPACITY: Record<string, number> = {
  Elite: 1,
  Strength: 0.75,
  Developing: 0.45,
  Weakness: 0.2,
};

export function tierOpacity(tier: string): number {
  return TIER_OPACITY[tier] ?? 0.3;
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const TIER_BADGE_ALPHA: Record<string, number> = {
  Elite: 1,
  Strength: 0.85,
  Developing: 0.4,
  Weakness: 0.18,
};

const TIER_USES_WHITE_TEXT: Record<string, boolean> = {
  Elite: true,
  Strength: true,
  Developing: false,
  Weakness: false,
};

export function tierBadgeStyle(category: Category, tier: string): { background: string; color: string } {
  const hex = CATEGORY_HEX[category];
  const alpha = TIER_BADGE_ALPHA[tier] ?? 0.3;
  const useWhite = TIER_USES_WHITE_TEXT[tier] ?? false;
  return {
    background: hexToRgba(hex, alpha),
    color: useWhite ? "#ffffff" : hex,
  };
}
