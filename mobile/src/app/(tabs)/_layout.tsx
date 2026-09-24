import { Redirect, Tabs } from "expo-router";
import { Text, type ColorValue } from "react-native";
import { useDefi } from "../../store";
import { colors } from "../../theme";

const icon = (glyph: string) =>
  function TabIcon({ color }: { color: ColorValue }) {
    return <Text style={{ fontSize: 18, color }}>{glyph}</Text>;
  };

export default function TabLayout() {
  const { state } = useDefi();
  if (!state.startDate) return <Redirect href="/onboarding" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.faint,
        tabBarStyle: { backgroundColor: colors.bg, borderTopColor: colors.cardBorder },
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Jour", tabBarIcon: icon("◉") }} />
      <Tabs.Screen name="parcours" options={{ title: "Parcours", tabBarIcon: icon("▦") }} />
      <Tabs.Screen name="idees" options={{ title: "Idées", tabBarIcon: icon("✎") }} />
      <Tabs.Screen name="bilans" options={{ title: "Bilans", tabBarIcon: icon("▲") }} />
      <Tabs.Screen name="alarmes" options={{ title: "Alarmes", tabBarIcon: icon("⏰") }} />
    </Tabs>
  );
}
