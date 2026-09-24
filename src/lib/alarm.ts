"use client";

/**
 * Alarme dans le navigateur : son genere (Web Audio) + notification systeme.
 *
 * Les navigateurs bloquent le son tant que l'utilisateur n'a pas touche la
 * page : unlockAudio() doit etre appele depuis un clic.
 */

let ctx: AudioContext | null = null;
let loop: ReturnType<typeof setInterval> | null = null;

export function unlockAudio() {
  if (typeof window === "undefined") return;
  if (!ctx) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") void ctx.resume();
}

function beep(frequency: number, at: number, duration = 0.18) {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "square";
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(0.25, at + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(at);
  osc.stop(at + duration + 0.02);
}

/** Trois bips courts. */
export function chime() {
  unlockAudio();
  if (!ctx) return;
  const t = ctx.currentTime;
  beep(880, t);
  beep(880, t + 0.25);
  beep(1320, t + 0.5, 0.35);
}

export function startRinging() {
  stopRinging();
  chime();
  loop = setInterval(chime, 1500);
  if ("vibrate" in navigator) navigator.vibrate?.([400, 200, 400, 200, 400]);
}

export function stopRinging() {
  if (loop) clearInterval(loop);
  loop = null;
}

export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return null;
  try {
    return await navigator.serviceWorker.register("/defi-sw.js", { scope: "/defi" });
  } catch {
    return null;
  }
}

export async function requestNotifications() {
  if (!("Notification" in window)) return "unsupported" as const;
  if (Notification.permission === "granted") return "granted" as const;
  return Notification.requestPermission();
}

export async function notify(title: string, body: string) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  // Sur Android, new Notification() est interdit : il faut passer par le service worker.
  const reg = "serviceWorker" in navigator ? await navigator.serviceWorker.getRegistration("/defi") : undefined;
  if (reg) {
    await reg.showNotification(title, {
      body,
      tag: "defi90",
      icon: "/defi-icon.svg",
      requireInteraction: true,
    } as NotificationOptions);
    return;
  }
  new Notification(title, { body, tag: "defi90" });
}
