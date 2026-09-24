import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { pillars, type DefiState, type Pillar } from "./shared";

/**
 * Alarmes = notifications locales programmees par le systeme.
 * Elles sonnent app fermee et telephone verrouille, sans serveur.
 */

export const alarmTexts: Record<Pillar, { title: string; body: string }> = {
  corps: {
    title: "🔥 Séance de sport",
    body: "Ton corps n'attend pas la motivation. Enfile tes affaires, maintenant.",
  },
  eloquence: {
    title: "🎙️ Éloquence",
    body: "10 minutes de parole. Debout, à voix haute, filmé.",
  },
  esprit: {
    title: "🧠 Journal & clarté",
    body: "Respiration, question du soir, vide ta tête. Puis dors.",
  },
};

const CHANNEL = "alarmes";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function ensurePermission() {
  if (Platform.OS === "web") return false;
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(CHANNEL, {
      name: "Alarmes du défi",
      importance: Notifications.AndroidImportance.MAX,
      sound: "default",
      vibrationPattern: [0, 500, 250, 500, 250, 500],
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: false,
    });
  }
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const asked = await Notifications.requestPermissionsAsync({
    ios: { allowAlert: true, allowSound: true, allowBadge: false },
  });
  return asked.granted;
}

/**
 * Reprogramme les 3 alarmes quotidiennes a partir de l'etat.
 * Appele a chaque changement d'heure, d'activation, ou a l'ouverture de l'app.
 */
export async function syncAlarms(state: DefiState, today: number) {
  if (Platform.OS === "web") return;
  await Notifications.cancelAllScheduledNotificationsAsync();
  // Defi termine ou pas commence : plus d'alarmes quotidiennes.
  if (!state.alarms.enabled || !state.startDate || today > 90) return;

  for (const p of Object.keys(pillars) as Pillar[]) {
    const [hour, minute] = state.alarms.times[p].split(":").map(Number);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Défi 90 — ${alarmTexts[p].title}`,
        body: alarmTexts[p].body,
        sound: "default",
        data: { pillar: p },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
        channelId: CHANNEL,
      },
    });
  }
}

export async function testAlarm() {
  if (Platform.OS === "web") return;
  await Notifications.scheduleNotificationAsync({
    content: { title: "Défi 90 — test", body: "Tes alarmes fonctionnent.", sound: "default" },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 5,
      channelId: CHANNEL,
    },
  });
}
