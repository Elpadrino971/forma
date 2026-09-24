import { router } from "expo-router";
import { Alert, Linking, Pressable, Share, Switch, Text, View } from "react-native";
import { ensurePermission, testAlarm } from "../../notifications";
import { defaultState, pillars, type Pillar } from "../../shared";
import { useDefi } from "../../store";
import { colors, pillarColors } from "../../theme";
import { Button, Card, Field, H1, H2, P, Screen } from "../../ui";

function shift(time: string, minutes: number) {
  const [h, m] = time.split(":").map(Number);
  const total = (((h * 60 + m + minutes) % 1440) + 1440) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

export default function AlarmsScreen() {
  const { state, update, replace } = useDefi();

  function setTime(p: Pillar, value: string) {
    update((s) => ({ ...s, alarms: { ...s.alarms, times: { ...s.alarms.times, [p]: value } } }));
  }

  async function toggleAlarms(on: boolean) {
    if (on) {
      const granted = await ensurePermission().catch(() => false);
      if (!granted) {
        Alert.alert(
          "Notifications refusées",
          "Sans notifications, les alarmes ne peuvent pas sonner. Autorise-les dans les réglages du téléphone.",
          [
            { text: "Plus tard", style: "cancel" },
            { text: "Ouvrir les réglages", onPress: () => Linking.openSettings() },
          ],
        );
        return;
      }
    }
    update((s) => ({ ...s, alarms: { ...s.alarms, enabled: on } }));
  }

  async function test() {
    const granted = await ensurePermission().catch(() => false);
    if (!granted) return toggleAlarms(true);
    await testAlarm();
    Alert.alert("Test programmé", "Verrouille ton téléphone : la notification arrive dans 5 secondes.");
  }

  function backup() {
    Share.share({ title: "Sauvegarde Défi 90", message: JSON.stringify(state) }).catch(() => {});
  }

  function reset() {
    Alert.alert(
      "Recommencer à zéro ?",
      "Ta progression et ton journal seront effacés. Partage une sauvegarde avant si tu veux les garder.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Tout effacer",
          style: "destructive",
          onPress: () => {
            replace({ ...defaultState, alarms: state.alarms, why: state.why, hardcore: state.hardcore });
            router.replace("/onboarding");
          },
        },
      ],
    );
  }

  return (
    <Screen>
      <H1>Alarmes</H1>

      <Card tone="brand">
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flex: 1, gap: 4 }}>
            <H2>Alarmes quotidiennes</H2>
            <P muted>Sonnent chaque jour, même app fermée et téléphone verrouillé.</P>
          </View>
          <Switch
            value={state.alarms.enabled}
            onValueChange={toggleAlarms}
            trackColor={{ true: colors.brand, false: "rgba(255,255,255,0.15)" }}
            thumbColor={colors.white}
          />
        </View>

        {(Object.keys(pillars) as Pillar[]).map((p) => (
          <View
            key={p}
            style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 6 }}
          >
            <Text style={{ color: pillarColors[p], fontWeight: "800", fontSize: 16 }}>{pillars[p].label}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Step label="−1h" onPress={() => setTime(p, shift(state.alarms.times[p], -60))} />
              <Step label="−5" onPress={() => setTime(p, shift(state.alarms.times[p], -5))} />
              <Text
                style={{
                  color: colors.white,
                  fontSize: 22,
                  fontWeight: "800",
                  width: 70,
                  textAlign: "center",
                  fontVariant: ["tabular-nums"],
                }}
              >
                {state.alarms.times[p]}
              </Text>
              <Step label="+5" onPress={() => setTime(p, shift(state.alarms.times[p], 5))} />
              <Step label="+1h" onPress={() => setTime(p, shift(state.alarms.times[p], 60))} />
            </View>
          </View>
        ))}

        <Button label="Tester une alarme (5 s)" variant="ghost" onPress={test} />
        <P muted style={{ fontSize: 12 }}>
          Astuce : sur iPhone, autorise les notifications de l&apos;app dans ton mode Concentration
          Sommeil, sinon l&apos;alarme du matin sera silencieuse.
        </P>
      </Card>

      <Card>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <View style={{ flex: 1, gap: 4 }}>
            <H2>Mode hardcore</H2>
            <P muted>Un jour raté = retour à J1. Sans exception.</P>
          </View>
          <Switch
            value={state.hardcore}
            onValueChange={(v) => update((s) => ({ ...s, hardcore: v }))}
            trackColor={{ true: colors.brand, false: "rgba(255,255,255,0.15)" }}
            thumbColor={colors.white}
          />
        </View>
      </Card>

      <Card>
        <H2>Mon pourquoi</H2>
        <Field value={state.why} onChangeText={(v) => update((s) => ({ ...s, why: v }))} multiline />
      </Card>

      <Card>
        <H2>Mes données</H2>
        <P muted>
          Tout reste sur ce téléphone, rien n&apos;est envoyé sur Internet. Si tu désinstalles
          l&apos;app, tout est perdu : partage une sauvegarde de temps en temps (vers tes notes ou tes
          mails).
        </P>
        <Button label="Partager une sauvegarde" variant="ghost" onPress={backup} />
        <Button label="Recommencer à zéro" variant="danger" onPress={reset} />
      </Card>
    </Screen>
  );
}

function Step({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      hitSlop={4}
      style={({ pressed }) => ({
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 7,
        backgroundColor: pressed ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.07)",
      })}
    >
      <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "700" }}>{label}</Text>
    </Pressable>
  );
}
