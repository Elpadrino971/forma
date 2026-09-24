import { Text, View } from "react-native";
import { checkinDays, checkinFields, type CheckinKey } from "../../shared";
import { useDefi } from "../../store";
import { colors } from "../../theme";
import { Card, Field, H1, H2, P, Screen } from "../../ui";

export default function CheckinsScreen() {
  const { state, update, today } = useDefi();

  function write(day: number, key: CheckinKey | "note", value: string) {
    update((s) => ({ ...s, checkins: { ...s.checkins, [day]: { ...s.checkins[day], [key]: value } } }));
  }

  return (
    <Screen>
      <H1>Bilans</H1>
      <P muted>
        J1, J30, J60, J90. Mêmes mesures, mêmes tests, même heure de la journée. Prends aussi une photo
        de face et de profil à chaque bilan. Les chiffres ne mentent pas, le miroir si.
      </P>

      <Card style={{ gap: 0, padding: 12 }}>
        <View style={{ flexDirection: "row", paddingBottom: 8 }}>
          <Text style={{ flex: 1.6, color: colors.faint, fontSize: 12 }}>Mesure</Text>
          {checkinDays.map((d) => (
            <Text key={d} style={{ flex: 1, color: colors.white, fontWeight: "700", textAlign: "center" }}>
              J{d}
            </Text>
          ))}
        </View>
        {checkinFields.map((f) => (
          <View key={f.key} style={{ flexDirection: "row", alignItems: "center", gap: 4, paddingVertical: 4 }}>
            <Text style={{ flex: 1.6, color: colors.muted, fontSize: 13 }}>
              {f.label}
              {f.unit ? <Text style={{ color: colors.fainter }}> ({f.unit})</Text> : null}
            </Text>
            {checkinDays.map((d) => (
              <Field
                key={d}
                value={state.checkins[d]?.[f.key] ?? ""}
                onChangeText={(v) => write(d, f.key, v)}
                editable={d <= today}
                keyboardType="decimal-pad"
                accessibilityLabel={`${f.label} J${d}`}
                style={{ flex: 1, paddingVertical: 8, paddingHorizontal: 4, textAlign: "center", opacity: d <= today ? 1 : 0.3 }}
              />
            ))}
          </View>
        ))}
      </Card>

      {checkinDays
        .filter((d) => d <= today)
        .map((d) => (
          <Card key={d}>
            <H2>Note du J{d}</H2>
            <P muted>Comment tu te sens, ce qui a changé</P>
            <Field value={state.checkins[d]?.note ?? ""} onChangeText={(v) => write(d, "note", v)} multiline />
          </Card>
        ))}
    </Screen>
  );
}
