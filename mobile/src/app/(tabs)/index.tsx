import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import {
  completedCount,
  dailyRules,
  dateOfDay,
  getDay,
  isDayComplete,
  missedDays,
  pillars,
  TOTAL_DAYS,
  type DefiState,
  type Mission,
} from "../../shared";
import { useDefi } from "../../store";
import { colors, pillarColors } from "../../theme";
import { Timer } from "../../Timer";
import { Button, Card, CheckRow, Eyebrow, Field, H1, H2, P, Screen } from "../../ui";

const dateFormat = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" });

export default function DayScreen() {
  const { state, update, today, todayISO } = useDefi();
  const params = useLocalSearchParams<{ day?: string }>();
  const requested = params.day ? Number(params.day) : today;
  const n = Math.min(Math.max(requested || 1, 1), TOTAL_DAYS);

  const missed = missedDays(state, today);
  const hardcoreFail = state.hardcore && missed.length > 0 && today <= TOTAL_DAYS;

  function go(day: number) {
    router.setParams({ day: day === today ? "" : String(day) });
  }

  function restart() {
    update((s) => ({ ...s, startDate: todayISO, done: {}, rules: {}, journal: {}, checkins: {} }));
    router.setParams({ day: "" });
  }

  if (today > TOTAL_DAYS && !params.day) {
    return (
      <Screen>
        <View style={{ paddingVertical: 40, gap: 16 }}>
          <Eyebrow>Défi terminé</Eyebrow>
          <H1>
            {completedCount(state)} / {TOTAL_DAYS} jours validés.
          </H1>
          <P>
            Tu peux réapparaître. Compare tes bilans J1 et J90, regarde ta vidéo du premier jour, puis
            celle du discours final. Et décide de la suite.
          </P>
          <Button label="Lancer 90 nouveaux jours" onPress={restart} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      {hardcoreFail ? (
        <Card tone="danger">
          <Text style={{ color: colors.danger, fontWeight: "800", fontSize: 16 }}>
            Mode hardcore : tu as raté le jour {missed[0]}.
          </Text>
          <P>
            La règle était claire. Tu repars à J1 aujourd&apos;hui, plus fort que la première fois. Ton
            journal sera effacé (partage-le depuis « Alarmes » avant si tu veux le garder).
          </P>
          <Button label="Recommencer à J1" variant="danger" onPress={restart} />
        </Card>
      ) : (
        <Banners state={state} today={today} />
      )}

      {today < 1 ? (
        <Card>
          <P>
            Le défi commence demain. Règle tes alarmes, prépare tes affaires de sport, dors tôt. Voici
            ce qui t&apos;attend :
          </P>
        </Card>
      ) : null}

      <DayView n={n} today={today} onNavigate={go} />
    </Screen>
  );
}

function DayView({ n, today, onNavigate }: { n: number; today: number; onNavigate: (n: number) => void }) {
  const { state, update } = useDefi();
  const day = getDay(n);
  const done = state.done[n] ?? {};
  const rules = state.rules[n] ?? [];
  const journal = state.journal[n] ?? {};
  const locked = n > today;
  const complete = isDayComplete(state, n);
  const date = state.startDate ? dateFormat.format(dateOfDay(state.startDate, n)) : "";

  function toggleMission(m: Mission) {
    const next = !state.done[n]?.[m.pillar];
    if (next) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    update((s) => ({ ...s, done: { ...s.done, [n]: { ...s.done[n], [m.pillar]: next } } }));
  }

  function toggleRule(i: number) {
    update((s) => {
      const current = s.rules[n] ?? [];
      const next = current.includes(i) ? current.filter((r) => r !== i) : [...current, i];
      return { ...s, rules: { ...s.rules, [n]: next } };
    });
  }

  function writeJournal(field: "priorities" | "evening", value: string) {
    update((s) => ({ ...s, journal: { ...s.journal, [n]: { ...s.journal[n], [field]: value } } }));
  }

  return (
    <>
      <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
        <View style={{ gap: 4, flex: 1 }}>
          <Eyebrow>
            Phase {day.phase.index + 1} · {day.phase.name}
          </Eyebrow>
          <H1>
            Jour {n}
            <Text style={{ color: colors.fainter }}> / {TOTAL_DAYS}</Text>
          </H1>
          <P muted>
            {date.charAt(0).toUpperCase() + date.slice(1)}
            {n === today ? " · aujourd'hui" : ""}
          </P>
        </View>
        <View style={{ flexDirection: "row", gap: 6 }}>
          <RoundButton label="‹" disabled={n <= 1} onPress={() => onNavigate(n - 1)} a11y="Jour précédent" />
          <RoundButton
            label="›"
            disabled={n >= TOTAL_DAYS}
            onPress={() => onNavigate(n + 1)}
            a11y="Jour suivant"
          />
        </View>
      </View>

      {n !== today && today >= 1 && today <= TOTAL_DAYS ? (
        <Pressable onPress={() => onNavigate(today)}>
          <Text style={{ color: colors.brand, fontWeight: "700" }}>← Revenir à aujourd&apos;hui (J{today})</Text>
        </Pressable>
      ) : null}

      {locked ? (
        <Card>
          <P>Aperçu. Ce jour se débloque le moment venu : on ne prend pas d&apos;avance, on est régulier.</P>
        </Card>
      ) : null}

      {complete ? (
        <Card tone="success">
          <Text style={{ color: colors.success, fontWeight: "700" }}>
            Jour {n} validé. Une brique de plus. Personne ne l&apos;a vue, et c&apos;est très bien.
          </Text>
        </Card>
      ) : null}

      {day.checkin ? (
        <Pressable onPress={() => router.navigate("/bilans")}>
          <Card tone="brand">
            <Text style={{ color: colors.brand, fontWeight: "800" }}>Jour de bilan</Text>
            <P>Mesures, tests, notes : prends 10 minutes pour remplir ton bilan J{n}. →</P>
          </Card>
        </Pressable>
      ) : null}

      {day.missions.map((m) => (
        <MissionCard
          key={`${n}-${m.pillar}`}
          mission={m}
          done={Boolean(done[m.pillar])}
          disabled={locked}
          onToggle={() => toggleMission(m)}
        />
      ))}

      <Card>
        <H2>Journal</H2>
        <P muted>Mes 3 priorités du jour</P>
        <Field
          value={journal.priorities ?? ""}
          onChangeText={(v) => writeJournal("priorities", v)}
          editable={!locked}
          multiline
          placeholder={"1.\n2.\n3."}
        />
        <P style={{ marginTop: 8 }}>
          <Text style={{ color: colors.success, fontWeight: "700" }}>Question du soir : </Text>
          {day.missions[2].focus}
        </P>
        <Field
          value={journal.evening ?? ""}
          onChangeText={(v) => writeJournal("evening", v)}
          editable={!locked}
          multiline
          placeholder="Écris sans te relire. Personne ne lira ça à part toi."
          style={{ minHeight: 140 }}
        />
      </Card>

      <Card>
        <H2>Règles non négociables</H2>
        {dailyRules.map((rule, i) => (
          <CheckRow
            key={rule}
            label={rule}
            checked={rules.includes(i)}
            onToggle={() => toggleRule(i)}
            disabled={locked}
          />
        ))}
      </Card>

      <Card tone="success">
        <Eyebrow color={colors.success}>Modèle mental de la semaine</Eyebrow>
        <H2>{day.model.name}</H2>
        <P>{day.model.idea}</P>
      </Card>
    </>
  );
}

function MissionCard({
  mission,
  done,
  disabled,
  onToggle,
}: {
  mission: Mission;
  done: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  const [open, setOpen] = useState(!done);
  const [focus, setFocus] = useState<string | undefined>(undefined);
  const shownFocus = focus ?? mission.focus;
  const color = pillarColors[mission.pillar];

  function shuffle() {
    const pool = mission.pool;
    if (!pool) return;
    let next = shownFocus;
    while (pool.length > 1 && next === shownFocus) next = pool[Math.floor(Math.random() * pool.length)];
    setFocus(next);
  }

  return (
    <Card tone={done ? "success" : "default"}>
      <View style={{ flexDirection: "row", gap: 14, alignItems: "center" }}>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: done, disabled }}
          accessibilityLabel={mission.title}
          onPress={onToggle}
          disabled={disabled}
          hitSlop={10}
          style={{
            width: 34,
            height: 34,
            borderRadius: 17,
            borderWidth: 2,
            alignItems: "center",
            justifyContent: "center",
            borderColor: done ? colors.success : "rgba(255,255,255,0.3)",
            backgroundColor: done ? colors.success : "transparent",
            opacity: disabled ? 0.4 : 1,
          }}
        >
          {done ? <Text style={{ color: colors.bg, fontWeight: "900", fontSize: 16 }}>✓</Text> : null}
        </Pressable>
        <Pressable style={{ flex: 1 }} onPress={() => setOpen((o) => !o)}>
          <Eyebrow color={color}>
            {pillars[mission.pillar].label} · {mission.minutes} min
          </Eyebrow>
          <Text style={{ fontSize: 18, fontWeight: "800", color: done ? colors.faint : colors.white, marginTop: 2 }}>
            {mission.title}
          </Text>
        </Pressable>
      </View>

      {open ? (
        <View style={{ gap: 12, marginTop: 4 }}>
          {shownFocus ? (
            <View style={{ backgroundColor: colors.field, borderRadius: 12, padding: 14, gap: 6 }}>
              <Text style={{ color: colors.white, fontSize: 17, fontWeight: "700", lineHeight: 24 }}>
                « {shownFocus} »
              </Text>
              {mission.pool ? (
                <Pressable onPress={shuffle} hitSlop={8}>
                  <Text style={{ color: colors.faint, fontWeight: "700" }}>↻ Autre sujet</Text>
                </Pressable>
              ) : null}
            </View>
          ) : null}
          {mission.steps.map((step, i) => (
            <View key={i} style={{ flexDirection: "row", gap: 10 }}>
              <Text style={{ color: colors.fainter, width: 20, textAlign: "right" }}>{i + 1}.</Text>
              <P style={{ flex: 1, color: colors.text }}>{step}</P>
            </View>
          ))}
          {mission.timer ? <Timer seconds={mission.timer} /> : null}
          {mission.tip ? <P muted style={{ fontStyle: "italic" }}>{mission.tip}</P> : null}
        </View>
      ) : null}
    </Card>
  );
}

function Banners({ state, today }: { state: DefiState; today: number }) {
  if (today < 2 || today > TOTAL_DAYS) {
    return state.why && today === 1 ? <Why text={state.why} /> : null;
  }
  const missedYesterday = !isDayComplete(state, today - 1);
  const missedTwo = today > 2 && missedYesterday && !isDayComplete(state, today - 2);

  if (missedTwo) {
    return (
      <Card tone="danger">
        <Text style={{ color: colors.danger, fontWeight: "800", fontSize: 16 }}>Deux jours ratés d&apos;affilée.</Text>
        <P>
          C&apos;est exactement là que les gens abandonnent. Pas toi. Fais la version minimum
          aujourd&apos;hui s&apos;il le faut, mais fais-la.
        </P>
        {state.why ? <Why text={state.why} /> : null}
      </Card>
    );
  }
  if (missedYesterday) {
    return (
      <Card tone="brand">
        <Text style={{ color: colors.brand, fontWeight: "800", fontSize: 16 }}>Hier n&apos;est pas validé.</Text>
        <P>Règle des deux jours : tu peux rater une fois, jamais deux. Aujourd&apos;hui, zéro excuse.</P>
      </Card>
    );
  }
  return null;
}

function Why({ text }: { text: string }) {
  return (
    <View style={{ borderLeftWidth: 2, borderLeftColor: colors.brand, paddingLeft: 12 }}>
      <P style={{ fontStyle: "italic" }}>Ton pourquoi : « {text} »</P>
    </View>
  );
}

function RoundButton({
  label,
  onPress,
  disabled,
  a11y,
}: {
  label: string;
  onPress: () => void;
  disabled: boolean;
  a11y: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11y}
      onPress={onPress}
      disabled={disabled}
      style={{
        width: 42,
        height: 42,
        borderRadius: 21,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        alignItems: "center",
        justifyContent: "center",
        opacity: disabled ? 0.3 : 1,
      }}
    >
      <Text style={{ color: colors.muted, fontSize: 22, marginTop: -2 }}>{label}</Text>
    </Pressable>
  );
}
