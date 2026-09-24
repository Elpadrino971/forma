import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: { absolute: "Défi 90 jours — Corps, éloquence, esprit" },
  description: "Disparais 90 jours, reviens méconnaissable. Sport, éloquence et clarté mentale, chaque jour.",
  manifest: "/defi.webmanifest",
  icons: { icon: "/defi-icon.svg", apple: "/defi-icon.svg" },
  appleWebApp: { capable: true, title: "Défi 90", statusBarStyle: "black-translucent" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0d0f15",
  viewportFit: "cover",
};

export default function DefiLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
