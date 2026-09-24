import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { ensurePermission } from "../notifications";
import { manifesto, phases, pillars, toISODate, TOTAL_DAYS, type Pillar } from "../shared";
import { useDefi } from "../store";
import { colors, pillarColors } from "../theme";
import { Button, Card, CheckRow, Eyebrow, Field, H1, P, Screen } from "../ui";

const pillarPitch: Record<Pillar, string> = {
  corps: "Une séance par jour, sans matériel, qui monte en intensité chaque semaine.",
  eloquence: "Improvisation, storytelling, débat, chasse aux « euh ». 10 à 15 min par jour.",
  esprit: "Journal guidé, respiration, un modèle mental par semaine pour penser plus clair.",
};

export default function Onboarding() {
  const { update } = useDefi();
  const [why, setWhy] = useState("");
  const [when, setWhen] = useState<"today" | "tomorrow">("today");
  const [hardcore, setHardcore] = useState(false);
  const [signed, setSigned] = useState(false);

  async function start() {
    const d = new Date();
    if (when === "tomorrow") d.setDate(d.getDate() + 1);
    const granted = await ensurePermission().catch(() => false);
    update((s) => ({
      ...s,
      startDate: toISODate(d),
      why: why.trim(),
      hardcore,
      alarms: { ...s.alarms, enabled: granted },
    }));
    router.replace("/alarmes");
  }

  return (
    <Screen>
      <View style={{ paddingTop: 16, gap: 12 }}>
        <Eyebrow>Défi contre soi</Eyebrow>
        <H1>Disparais {TOTAL_DAYS} jours.</H1>
        <Text style={{ fontSize: 34, fontWeight: "800", color: colors.brand, marginTop: -12 }}>
          Reviens méconnaissable.
        </Text>
        <P>
          Corps, éloquence, esprit. Trois missions par jour, un programme qui monte en puissance, des
          alarmes pour ne pas négocier avec toi-même.
        </P>
      </View>

      {manifesto.map((line, i) => (
        <Card key={line} style={{ flexDirection: "row", gap: 14 }}>
          <Text style={{ color: colors.brand, fontWeight: "700", fontVariant: ["tabular-nums"] }}>
            {String(i + 1).padStart(2, "0")}
          </Text>
          <P style={{ flex: 1, color: colors.text }}>{line}</P>
        </Card>
      ))}

      {(Object.keys(pillars) as Pillar[]).map((p) => (
        <Card key={p}>
          <Text style={{ color: pillarColors[p], fontWeight: "800", fontSize: 16 }}>{pillars[p].label}</Text>
          <P muted>{pillarPitch[p]}</P>
        </Card>
      ))}

      <Card>
        {phases.map((ph) => (
          <P key={ph.name}>
            <Text style={{ color: colors.fainter }}>
              J{ph.start}–{ph.end}{"  "}
            </Text>
            <Text style={{ color: colors.white, fontWeight: "700" }}>{ph.name}. </Text>
            {ph.goal}
          </P>
        ))}
      </Card>

      <Card tone="brand">
        <Text style={{ color: colors.white, fontWeight: "700" }}>Pourquoi tu fais ça ?</Text>
        <P muted>Ce texte reviendra les jours où tu voudras abandonner.</P>
        <Field
          value={why}
          onChangeText={setWhy}
          multiline
          placeholder="Parce que je suis fatigué d'être la version moyenne de moi-même…"
        />

        <Text style={{ color: colors.white, fontWeight: "700", marginTop: 8 }}>Jour 1</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {(["today", "tomorrow"] as const).map((w) => (
            <Pressable
              key={w}
              onPress={() => setWhen(w)}
              accessibilityState={{ selected: when === w }}
              style={{
                flex: 1,
                borderRadius: 12,
                borderWidth: 1,
                paddingVertical: 12,
                alignItems: "center",
                borderColor: when === w ? colors.brand : colors.cardBorder,
                backgroundColor: when === w ? colors.brandSoft : "transparent",
              }}
            >
              <Text style={{ color: when === w ? colors.white : colors.muted, fontWeight: "700" }}>
                {w === "today" ? "Aujourd'hui" : "Demain"}
              </Text>
            </Pressable>
          ))}
        </View>

        <CheckRow
          label="Mode hardcore — un jour raté et je recommence à J1."
          checked={hardcore}
          onToggle={() => setHardcore((h) => !h)}
        />
        <CheckRow
          label={`Je m'engage pour ${TOTAL_DAYS} jours. Je ne cherche pas d'excuse, je ne le crie pas sur les toits. Je fais.`}
          checked={signed}
          onToggle={() => setSigned((s) => !s)}
        />
        <Button label="Je disparais" onPress={start} disabled={!signed} />
      </Card>

      <P muted style={{ textAlign: "center", fontSize: 12 }}>
        Si tu as un problème de santé, fais valider le programme sportif avant de commencer.
      </P>
    </Screen>
  );
}
