import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import type { Idea } from "../../shared";
import { useDefi } from "../../store";
import { colors } from "../../theme";
import { Button, Card, Field, H1, H2, P, Screen } from "../../ui";

const buckets: { id: Idea["bucket"]; label: string; hint: string }[] = [
  { id: "agir", label: "Agir", hint: "Moins de 2 min ou prioritaire : fais-le aujourd'hui" },
  { id: "planifier", label: "Planifier", hint: "Important mais pas urgent : donne-lui une date" },
  { id: "reflechir", label: "Réfléchir", hint: "Une idée à creuser dans ton journal" },
  { id: "lacher", label: "Lâcher", hint: "Hors de ton contrôle ou sans importance : laisse partir" },
];

/** Vide-tete : on capture tout ce qui tourne en boucle, puis on trie. */
export default function IdeasScreen() {
  const { state, update } = useDefi();
  const [text, setText] = useState("");
  const inbox = state.ideas.filter((i) => i.bucket === "inbox");

  function add() {
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (!lines.length) return;
    const now = new Date().toISOString();
    update((s) => ({
      ...s,
      ideas: [
        ...lines.map((l, i) => ({ id: `${Date.now()}-${i}`, text: l, bucket: "inbox" as const, createdAt: now })),
        ...s.ideas,
      ],
    }));
    setText("");
  }

  function move(id: string, bucket: Idea["bucket"]) {
    update((s) => ({ ...s, ideas: s.ideas.map((i) => (i.id === id ? { ...i, bucket } : i)) }));
  }

  function remove(id: string) {
    update((s) => ({ ...s, ideas: s.ideas.filter((i) => i.id !== id) }));
  }

  return (
    <Screen>
      <H1>Vide ta tête</H1>
      <P muted>
        Tout ce qui tourne en boucle — tâches, idées, inquiétudes — sort d&apos;ici. Une ligne par
        pensée. Ensuite tu tries : une pensée rangée arrête de tourner.
      </P>
      <Field
        value={text}
        onChangeText={setText}
        multiline
        placeholder={"Appeler le médecin\nIdée de projet : …\nJe stresse pour lundi"}
      />
      <Button label="Sortir ça de ma tête" onPress={add} />

      {inbox.length ? <H2>À trier ({inbox.length})</H2> : null}
      {inbox.map((idea) => (
        <Card key={idea.id}>
          <Text style={{ color: colors.white, fontSize: 15 }}>{idea.text}</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {buckets.map((b) => (
              <Pressable
                key={b.id}
                onPress={() => move(idea.id, b.id)}
                style={{
                  borderWidth: 1,
                  borderColor: colors.cardBorder,
                  borderRadius: 10,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                }}
              >
                <Text style={{ color: colors.text, fontWeight: "600" }}>{b.label}</Text>
              </Pressable>
            ))}
          </View>
        </Card>
      ))}

      {buckets.map((b) => {
        const items = state.ideas.filter((i) => i.bucket === b.id);
        if (!items.length) return null;
        return (
          <Card key={b.id}>
            <H2>
              {b.label} <Text style={{ color: colors.fainter }}>({items.length})</Text>
            </H2>
            <P muted style={{ fontSize: 12 }}>
              {b.hint}
            </P>
            {items.map((idea) => (
              <View key={idea.id} style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 6 }}>
                <Text style={{ flex: 1, color: colors.text }}>{idea.text}</Text>
                <Pressable onPress={() => move(idea.id, "inbox")} hitSlop={8}>
                  <Text style={{ color: colors.fainter, fontSize: 12 }}>Retrier</Text>
                </Pressable>
                <Pressable onPress={() => remove(idea.id)} hitSlop={8}>
                  <Text style={{ color: b.id === "agir" ? colors.success : colors.fainter, fontSize: 12 }}>
                    {b.id === "agir" ? "Fait ✓" : "Supprimer"}
                  </Text>
                </Pressable>
              </View>
            ))}
          </Card>
        );
      })}
    </Screen>
  );
}
