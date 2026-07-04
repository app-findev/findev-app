import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import Slider from "@react-native-community/slider";
import Svg, { Path, Circle } from "react-native-svg";
import { colors } from "../theme";

const MIN = 500;
const MAX = 6000;

function BackIcon() {
  return (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 19l-7-7 7-7"
        stroke={colors.darkGreen}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function TargetIcon() {
  return (
    <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="8.5" stroke={colors.muted} strokeWidth={1.6} />
      <Circle cx="12" cy="12" r="4.5" stroke={colors.muted} strokeWidth={1.6} />
      <Circle cx="12" cy="12" r="1.2" fill={colors.muted} />
    </Svg>
  );
}

function formatCurrency(value) {
  return Math.round(value).toLocaleString("en-US");
}

export default function Budget({ navigation }) {
  const [amount, setAmount] = useState(2400);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.stepLabel}>Step 4 of 4</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.progressRow}>
        <View style={[styles.progressSegment, styles.progressDone]} />
        <View style={[styles.progressSegment, styles.progressDone]} />
        <View style={[styles.progressSegment, styles.progressDone]} />
        <View style={[styles.progressSegment, styles.progressActive]} />
      </View>

      <Text style={styles.heading}>Set your monthly budget</Text>
      <Text style={styles.subtitle}>You can fine-tune this anytime.</Text>

      <View style={styles.amountBlock}>
        <Text style={styles.amountLabel}>Monthly spending limit</Text>
        <View style={styles.amountRow}>
          <Text style={styles.amountSign}>$</Text>
          <Text style={styles.amountValue}>{formatCurrency(amount)}</Text>
        </View>

        <Slider
          style={styles.slider}
          minimumValue={MIN}
          maximumValue={MAX}
          step={50}
          value={amount}
          onValueChange={setAmount}
          minimumTrackTintColor={colors.darkGreen}
          maximumTrackTintColor={colors.track}
          thumbTintColor={colors.green}
        />

        <View style={styles.rangeRow}>
          <Text style={styles.rangeText}>${MIN.toLocaleString("en-US")}</Text>
          <Text style={styles.rangeText}>${MAX.toLocaleString("en-US")}</Text>
        </View>
      </View>

      <View style={styles.splitBox}>
        <Text style={styles.splitLabel}>Suggested split</Text>
        <View style={styles.splitBar}>
          <View style={[styles.splitSegment, { flex: 45, backgroundColor: colors.darkGreen }]} />
          <View style={[styles.splitSegment, { flex: 35, backgroundColor: colors.green }]} />
          <View style={[styles.splitSegment, { flex: 20, backgroundColor: "#0d1f04" }]} />
        </View>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.darkGreen }]} />
            <Text style={styles.legendText}>Essentials</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.green }]} />
            <Text style={styles.legendText}>Lifestyle</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#0d1f04" }]} />
            <Text style={styles.legendText}>Savings</Text>
          </View>
        </View>
      </View>

      <View style={styles.noteRow}>
        <TargetIcon />
        <Text style={styles.noteText}>
          Você acompanha esta meta na tela inicial, a cada despesa do mês.
        </Text>
      </View>

      <View style={{ flex: 1 }} />

      <TouchableOpacity style={styles.button} onPress={() => {}}>
        <Text style={styles.buttonText}>Finish setup  →</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#f0f2ec",
    alignItems: "center",
    justifyContent: "center",
  },
  stepLabel: {
    fontSize: 14,
    color: colors.mutedLight,
  },
  progressRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 20,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.track,
  },
  progressDone: {
    backgroundColor: colors.darkGreen,
  },
  progressActive: {
    backgroundColor: colors.green,
  },
  heading: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.darkGreen,
    marginTop: 28,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: colors.muted,
  },
  amountBlock: {
    marginTop: 28,
    alignItems: "center",
  },
  amountLabel: {
    fontSize: 13,
    color: colors.muted,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 8,
  },
  amountSign: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.darkGreen,
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 48,
    fontWeight: "800",
    color: colors.darkGreen,
  },
  slider: {
    width: "100%",
    height: 40,
    marginTop: 16,
  },
  rangeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  rangeText: {
    fontSize: 13,
    color: colors.mutedLight,
  },
  splitBox: {
    marginTop: 28,
    backgroundColor: colors.heroBg,
    borderRadius: 16,
    padding: 16,
  },
  splitLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.darkGreen,
    marginBottom: 10,
  },
  splitBar: {
    flexDirection: "row",
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  splitSegment: {
    height: "100%",
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: colors.muted,
  },
  noteRow: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 19,
  },
  button: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: colors.darkGreen,
    fontSize: 16,
    fontWeight: "700",
  },
});
