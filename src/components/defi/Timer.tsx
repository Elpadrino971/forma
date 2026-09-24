"use client";

import { useEffect, useRef, useState } from "react";
import { chime, unlockAudio } from "@/lib/alarm";

function format(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function Timer({ seconds }: { seconds: number }) {
  const [left, setLeft] = useState(seconds);
  const [running, setRunning] = useState(false);
  const endAt = useRef(0);

  useEffect(() => {
    setLeft(seconds);
    setRunning(false);
  }, [seconds]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const remaining = Math.max(0, Math.round((endAt.current - Date.now()) / 1000));
      setLeft(remaining);
      if (remaining === 0) {
        setRunning(false);
        chime();
      }
    }, 250);
    return () => clearInterval(id);
  }, [running]);

  function toggle() {
    unlockAudio();
    if (running) {
      setRunning(false);
      return;
    }
    const from = left === 0 ? seconds : left;
    endAt.current = Date.now() + from * 1000;
    setLeft(from);
    setRunning(true);
  }

  const progress = 1 - left / seconds;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 p-3">
      <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-brand-500 transition-[width] duration-200"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <span className="w-14 text-right font-mono text-lg tabular-nums text-white" aria-live="polite">
        {format(left)}
      </span>
      <button
        type="button"
        onClick={toggle}
        className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-semibold text-white hover:bg-white/15"
      >
        {running ? "Pause" : left === seconds || left === 0 ? "Go" : "Reprendre"}
      </button>
      {left !== seconds && !running ? (
        <button
          type="button"
          onClick={() => setLeft(seconds)}
          className="text-sm text-ink-400 hover:text-white"
        >
          Reset
        </button>
      ) : null}
    </div>
  );
}
