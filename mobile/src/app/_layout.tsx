import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { syncAlarms } from "../notifications";
import { DefiProvider, useDefi } from "../store";
import { colors } from "../theme";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <DefiProvider fallback={<View style={{ flex: 1, backgroundColor: colors.bg }} />}>
        <AlarmSync />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
        </Stack>
      </DefiProvider>
    </SafeAreaProvider>
  );
}

/** Garde les notifications programmees alignees sur les reglages. */
function AlarmSync() {
  const { state, today } = useDefi();
  const { enabled, times } = state.alarms;
  const finished = today > 90;

  useEffect(() => {
    syncAlarms(state, today).catch(() => {});
    // On ne reprogramme que si les heures, l'activation ou le demarrage changent.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, times.corps, times.eloquence, times.esprit, state.startDate, finished]);

  return null;
}
