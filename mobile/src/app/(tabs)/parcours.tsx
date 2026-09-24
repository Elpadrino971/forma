import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import {
  checkinDays,
  completedCount,
  currentStreak,
  isDayComplete,
  phases,
  pillars,
  TOTAL_DAYS,
  type Pillar,
} from "../../shared";
import { useDefi } from "../../store";
import { colors, pillarColors } from "../../theme";
import { Card, Eyebrow, H1, H2, P, Screen } from "../../ui";

export default function JourneyScreen() {
  const { state, today } = useDefi();
  const streak = currentStreak(state, Math.min(today, TOTAL_DAYS));

  return (
    <Screen>
      <H1>Le parcours</H1>

      <View style={{ flexDirection: "row", gap: 10 }}>
        <Stat label="Validés" value={completedCount(state)} sub={`/ ${TOTAL_DAYS}`} />
        <Stat label="Série" value={streak} sub={streak > 1 ? "jours" : "jour"} />
        <Stat label="Restants" value={Math.max(0, TOTAL_DAYS - Math.max(today, 0))} sub="jours" />
      </View>

      <Card style={{ flexDirection: "row", justifyContent: "space-around" }}>
        {(Object.keys(pillars) as Pillar[]).map((p) => (
          <View key={p} style={{ alignItems: "center" }}>
            <Text style={{ color: pillarColors[p], fontSize: 24, fontWeight: "800" }}>
              {Object.values(state.done).filter((d) => d[p]).length}
            </Text>
            <Text style={{ color: colors.faint, fontSize: 12 }}>{pillars[p].label}</Text>
          </View>
        ))}
      </Card>

      {phases.map((phase) => (
        <Card key={phase.name}>
          <Eyebrow>
            Phase {phase.index + 1} · J{phase.start}–J{phase.end}
          </Eyebrow>
          <H2>{phase.name}</H2>
          <P muted>{phase.goal}</P>
          <View style={{ gap: 5, marginTop: 6 }}>
            {[0, 10, 20].map((offset) => (
              <View key={offset} style={{ flexDirection: "row", gap: 5 }}>
                {Array.from({ length: 10 }, (_, i) => phase.start + offset + i).map((n) => (
                  <DayCell key={n} n={n} />
                ))}
              </View>
            ))}
          </View>
        </Card>
      ))}

      <P muted style={{ fontSize: 12 }}>
        Vert : validé · Vert pâle : commencé · Rouge : raté · Point orange : jour de bilan
      </P>
    </Screen>
  );
}

function DayCell({ n }: { n: number }) {
  const { state, today } = useDefi();
  const complete = isDayComplete(state, n);
  const partial = !complete && Object.values(state.done[n] ?? {}).some(Boolean);
  const missed = !complete && n < today;
  return (
    <Pressable
      accessibilityLabel={`Jour ${n}`}
      onPress={() => router.navigate({ pathname: "/", params: { day: String(n) } })}
      style={{
        flex: 1,
        aspectRatio: 1,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: complete
          ? colors.success
          : partial
            ? "rgba(52,211,153,0.3)"
            : missed
              ? "rgba(239,68,68,0.2)"
              : "rgba(255,255,255,0.05)",
        borderWidth: 2,
        borderColor: n === today ? colors.brand : "transparent",
      }}
    >
      <Text style={{ fontSize: 10, fontWeight: "700", color: complete ? colors.bg : missed ? colors.danger : colors.fainter }}>
        {n}
      </Text>
      {checkinDays.includes(n) ? (
        <View
          style={{ position: "absolute", top: 2, right: 2, width: 4, height: 4, borderRadius: 2, backgroundColor: colors.brand }}
        />
      ) : null}
    </Pressable>
  );
}

function Stat({ label, value, sub }: { label: string; value: number; sub: string }) {
  return (
    <Card style={{ flex: 1, gap: 2, padding: 14 }}>
      <Text style={{ color: colors.faint, fontSize: 12 }}>{label}</Text>
      <Text style={{ color: colors.white, fontSize: 24, fontWeight: "800" }}>
        {value} <Text style={{ color: colors.fainter, fontSize: 12, fontWeight: "500" }}>{sub}</Text>
      </Text>
    </Card>
  );
}
