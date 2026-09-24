// Service worker du defi 90 jours : sert uniquement a afficher les
// notifications d'alarme et a rouvrir l'app quand on clique dessus.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const open = clients.find((c) => new URL(c.url).pathname.startsWith("/defi"));
      if (open) return open.focus();
      return self.clients.openWindow("/defi");
    }),
  );
});
