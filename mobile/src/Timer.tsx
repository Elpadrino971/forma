import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState } from "react";
import { Pressable, Text, Vibration, View } from "react-native";
import { colors } from "./theme";

function format(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function Timer({ seconds }: { seconds: number }) {
  const [left, setLeft] = useState(seconds);
  const [running, setRunning] = useState(false);
  const endAt = useRef(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const remaining = Math.max(0, Math.round((endAt.current - Date.now()) / 1000));
      setLeft(remaining);
      if (remaining === 0) {
        setRunning(false);
        Vibration.vibrate([0, 400, 200, 400]);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      }
    }, 250);
    return () => clearInterval(id);
  }, [running]);

  function toggle() {
    Haptics.selectionAsync().catch(() => {});
    if (running) {
      setRunning(false);
      return;
    }
    const from = left === 0 ? seconds : left;
    endAt.current = Date.now() + from * 1000;
    setLeft(from);
    setRunning(true);
  }

  const progress = 1 - left / seconds;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        backgroundColor: colors.field,
        borderRadius: 12,
        padding: 12,
      }}
    >
      <View style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.1)" }}>
        <View
          style={{ width: `${progress * 100}%`, height: 6, borderRadius: 3, backgroundColor: colors.brand }}
        />
      </View>
      <Text
        style={{ color: colors.white, fontSize: 18, fontVariant: ["tabular-nums"], fontWeight: "600" }}
        accessibilityLiveRegion="polite"
      >
        {format(left)}
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={toggle}
        onLongPress={() => {
          setRunning(false);
          setLeft(seconds);
        }}
        style={{ backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 10, paddingVertical: 8, paddingHorizontal: 14 }}
      >
        <Text style={{ color: colors.white, fontWeight: "700" }}>
          {running ? "Pause" : left === seconds || left === 0 ? "Go" : "Reprendre"}
        </Text>
      </Pressable>
    </View>
  );
}
