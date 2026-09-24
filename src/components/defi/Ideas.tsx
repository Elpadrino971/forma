"use client";

import { useState, type FormEvent } from "react";
import type { DefiState, Idea } from "@/lib/defi-store";

const buckets: { id: Idea["bucket"]; label: string; hint: string }[] = [
  { id: "agir", label: "Agir", hint: "Moins de 2 min ou prioritaire : fais-le aujourd'hui" },
  { id: "planifier", label: "Planifier", hint: "Important mais pas urgent : donne-lui une date" },
  { id: "reflechir", label: "Réfléchir", hint: "Une idée à creuser dans ton journal" },
  { id: "lacher", label: "Lâcher", hint: "Hors de ton contrôle ou sans importance : laisse partir" },
];

/**
 * Vide-tete : on capture tout ce qui tourne en boucle, puis on trie.
 * Une pensee rangee dans une case arrete de tourner dans la tete.
 */
export function Ideas({
  state,
  update,
}: {
  state: DefiState;
  update: (fn: (s: DefiState) => DefiState) => void;
}) {
  const [text, setText] = useState("");
  const inbox = state.ideas.filter((i) => i.bucket === "inbox");

  function add(e: FormEvent) {
    e.preventDefault();
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (!lines.length) return;
    const now = new Date().toISOString();
    update((s) => ({
      ...s,
      ideas: [
        ...lines.map((l, i) => ({ id: `${Date.now()}-${i}`, text: l, bucket: "inbox" as const, createdAt: now })),
        ...s.ideas,
      ],
    }));
    setText("");
  }

  function move(id: string, bucket: Idea["bucket"]) {
    update((s) => ({ ...s, ideas: s.ideas.map((i) => (i.id === id ? { ...i, bucket } : i)) }));
  }

  function remove(id: string) {
    update((s) => ({ ...s, ideas: s.ideas.filter((i) => i.id !== id) }));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Vide ta tête</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-400">
          Tout ce qui tourne en boucle — tâches, idées, inquiétudes — sort d&apos;ici. Une ligne par
          pensée. Ensuite tu tries : une pensée rangée arrête de tourner.
        </p>
      </div>

      <form onSubmit={add} className="space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder={"Appeler le médecin\nIdée de projet : …\nJe stresse pour lundi"}
          className="w-full rounded-xl border border-white/10 bg-black/30 p-3 text-white placeholder:text-ink-600 focus:border-brand-500 focus:outline-none"
        />
        <button
          type="submit"
          className="w-full rounded-xl bg-brand-500 px-6 py-3 font-semibold text-ink-950 hover:bg-brand-400"
        >
          Sortir ça de ma tête
        </button>
      </form>

      {inbox.length ? (
        <section>
          <h2 className="font-semibold text-white">À trier ({inbox.length})</h2>
          <ul className="mt-3 space-y-3">
            {inbox.map((idea) => (
              <li key={idea.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-white">{idea.text}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {buckets.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => move(idea.id, b.id)}
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-ink-200 hover:bg-white/10"
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {buckets.map((b) => {
        const items = state.ideas.filter((i) => i.bucket === b.id);
        if (!items.length) return null;
        return (
          <section key={b.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="font-semibold text-white">
              {b.label} <span className="text-ink-500">({items.length})</span>
            </h2>
            <p className="text-xs text-ink-500">{b.hint}</p>
            <ul className="mt-3 space-y-1">
              {items.map((idea) => (
                <li key={idea.id} className="group flex items-center gap-3 rounded-lg p-2 hover:bg-white/5">
                  <span className="flex-1 text-sm text-ink-200">{idea.text}</span>
                  <button
                    type="button"
                    onClick={() => move(idea.id, "inbox")}
                    className="text-xs text-ink-500 hover:text-white"
                  >
                    Retrier
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(idea.id)}
                    className="text-xs text-ink-500 hover:text-red-300"
                  >
                    {b.id === "agir" ? "Fait ✓" : "Supprimer"}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
