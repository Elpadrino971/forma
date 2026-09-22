"use client";

import { useState } from "react";

export function CheckoutButton({
  planId,
  label,
  highlight,
}: {
  planId: string;
  label: string;
  highlight: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        setError(data.error ?? "Le paiement n'a pas pu démarrer.");
        setLoading(false);
        return;
      }

      // Redirection vers la page de paiement hebergee par Stripe.
      window.location.href = data.url;
    } catch {
      setError("Connexion impossible. Vérifie ta connexion et réessaie.");
      setLoading(false);
    }
  }

  const base =
    "w-full rounded-xl px-6 py-3.5 text-base font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60";
  const variant = highlight
    ? "bg-brand-500 text-ink-950 hover:bg-brand-400"
    : "border border-white/15 text-white hover:bg-white/5";

  return (
    <div>
      <button type="button" onClick={handleClick} disabled={loading} className={`${base} ${variant}`}>
        {loading ? "Redirection…" : label}
      </button>

      {error ? (
        <p role="alert" className="mt-3 text-sm text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}
