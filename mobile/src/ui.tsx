import type { ReactNode } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "./theme";

export function Screen({ children }: { children: ReactNode }) {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function Card({
  children,
  tone = "default",
  style,
}: {
  children: ReactNode;
  tone?: "default" | "brand" | "success" | "danger";
  style?: StyleProp<ViewStyle>;
}) {
  const toneStyle = {
    default: null,
    brand: { backgroundColor: colors.brandSoft, borderColor: "rgba(249,115,22,0.35)" },
    success: { backgroundColor: colors.successSoft, borderColor: "rgba(52,211,153,0.3)" },
    danger: { backgroundColor: colors.dangerSoft, borderColor: "rgba(239,68,68,0.4)" },
  }[tone];
  return <View style={[styles.card, toneStyle, style]}>{children}</View>;
}

export function Eyebrow({ children, color = colors.brand }: { children: ReactNode; color?: string }) {
  return <Text style={[styles.eyebrow, { color }]}>{children}</Text>;
}

export function H1({ children }: { children: ReactNode }) {
  return <Text style={styles.h1}>{children}</Text>;
}

export function H2({ children }: { children: ReactNode }) {
  return <Text style={styles.h2}>{children}</Text>;
}

export function P({ children, muted, style }: { children: ReactNode; muted?: boolean; style?: object }) {
  return <Text style={[styles.p, muted && { color: colors.faint }, style]}>{children}</Text>;
}

export function Button({
  label,
  onPress,
  variant = "primary",
  disabled,
}: {
  label: string;
  onPress: () => void;
  variant?: "primary" | "ghost" | "danger";
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        variant === "primary" && { backgroundColor: colors.brand },
        variant === "ghost" && { borderWidth: 1, borderColor: "rgba(255,255,255,0.15)" },
        variant === "danger" && { backgroundColor: colors.dangerSoft },
        (pressed || disabled) && { opacity: disabled ? 0.45 : 0.8 },
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          variant === "primary" && { color: colors.bg },
          variant === "danger" && { color: colors.danger },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function CheckRow({
  label,
  checked,
  onToggle,
  disabled,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      onPress={onToggle}
      disabled={disabled}
      style={[styles.checkRow, disabled && { opacity: 0.5 }]}
    >
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked ? <Text style={styles.tick}>✓</Text> : null}
      </View>
      <Text style={[styles.p, { flex: 1 }, checked && styles.struck]}>{label}</Text>
    </Pressable>
  );
}

export function Field(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={colors.fainter}
      {...props}
      style={[styles.field, props.multiline && { minHeight: 90, textAlignVertical: "top" }, props.style]}
    />
  );
}

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 16, paddingBottom: 48, gap: 16 },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    gap: 10,
  },
  eyebrow: { fontSize: 12, fontWeight: "700", letterSpacing: 2, textTransform: "uppercase" },
  h1: { fontSize: 34, fontWeight: "800", color: colors.white, letterSpacing: -0.5 },
  h2: { fontSize: 18, fontWeight: "700", color: colors.white },
  p: { fontSize: 15, lineHeight: 22, color: colors.muted },
  button: { borderRadius: 14, paddingVertical: 14, paddingHorizontal: 18, alignItems: "center" },
  buttonText: { fontSize: 16, fontWeight: "700", color: colors.white },
  checkRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 8 },
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  boxChecked: { backgroundColor: colors.success, borderColor: colors.success },
  tick: { color: colors.bg, fontWeight: "900", fontSize: 14 },
  struck: { textDecorationLine: "line-through", color: colors.fainter },
  field: {
    backgroundColor: colors.field,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    color: colors.white,
    fontSize: 15,
  },
});
