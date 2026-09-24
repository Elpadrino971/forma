import type { Pillar } from "./shared";

export const colors = {
  bg: "#0d0f15",
  card: "#161922",
  cardBorder: "rgba(255,255,255,0.08)",
  field: "#0a0c11",
  text: "#eceef2",
  white: "#ffffff",
  muted: "#b0b8c9",
  faint: "#8490a9",
  fainter: "#65718c",
  brand: "#f97316",
  brandSoft: "rgba(249,115,22,0.12)",
  success: "#34d399",
  successSoft: "rgba(52,211,153,0.10)",
  danger: "#f87171",
  dangerSoft: "rgba(239,68,68,0.12)",
};

export const pillarColors: Record<Pillar, string> = {
  corps: "#fb923c",
  eloquence: "#38bdf8",
  esprit: "#34d399",
};
