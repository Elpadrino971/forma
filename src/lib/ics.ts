/**
 * Genere un fichier calendrier (.ics) avec une alarme quotidienne par pilier.
 *
 * C'est la seule alarme vraiment fiable pour une app web : une fois importee
 * dans le calendrier du telephone, elle sonne meme ecran verrouille et
 * navigateur ferme.
 */

export type IcsAlarm = {
  uid: string;
  title: string;
  description: string;
  /** "HH:MM" en heure locale */
  time: string;
  minutes: number;
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function stamp(d: Date) {
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}

function escapeText(s: string) {
  return s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

export function buildIcs(alarms: IcsAlarm[], firstDay: Date, count: number, url: string) {
  const y = firstDay.getFullYear();
  const m = pad(firstDay.getMonth() + 1);
  const d = pad(firstDay.getDate());
  const now = stamp(new Date());

  const events = alarms.flatMap((a) => {
    const [hh, mm] = a.time.split(":");
    return [
      "BEGIN:VEVENT",
      `UID:${a.uid}-${y}${m}${d}@defi90`,
      `DTSTAMP:${now}`,
      // Heure "flottante" (sans fuseau) : le telephone l'interprete dans son fuseau local.
      `DTSTART:${y}${m}${d}T${hh}${mm}00`,
      `DURATION:PT${a.minutes}M`,
      `RRULE:FREQ=DAILY;COUNT=${count}`,
      `SUMMARY:${escapeText(a.title)}`,
      `DESCRIPTION:${escapeText(`${a.description}\n${url}`)}`,
      `URL:${url}`,
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      `DESCRIPTION:${escapeText(a.title)}`,
      "TRIGGER:PT0M",
      "END:VALARM",
      "END:VEVENT",
    ];
  });

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Defi 90 jours//FR",
    "CALSCALE:GREGORIAN",
    "X-WR-CALNAME:Défi 90 jours",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(href), 1000);
}
