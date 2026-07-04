import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import TrendIcon from "../components/TrendIcon";
import { colors } from "../theme";

export default function Welcome({ navigation }) {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.brandRow}>
        <View style={styles.logoBox}>
          <TrendIcon size={18} />
        </View>
        <Text style={styles.brandName}>SpentLittle</Text>
      </View>

      <View style={styles.heroWrapper}>
        <View style={styles.heroIconBox}>
          <View style={styles.heroIconInner}>
            <TrendIcon size={20} />
          </View>
        </View>
        <Text style={styles.heroLabel}>hero illustration</Text>
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.heading}>
          Spend a little,{"\n"}save a{" "}
          <Text style={styles.highlight}> lot </Text>.
        </Text>
        <Text style={styles.subtitle}>
          Track every dollar, hit your goals, and feel good about your money.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("CreateAccount")}
        >
          <Text style={styles.buttonText}>Get started  →</Text>
        </TouchableOpacity>

        <Text style={styles.loginRow}>
          Already have an account? <Text style={styles.loginLink}>Log in</Text>
        </Text>
      </View>
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
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 24,
  },
  logoBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.darkGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  brandName: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.darkGreen,
  },
  heroWrapper: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: colors.heroBg,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    minHeight: 260,
  },
  heroIconBox: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  heroIconInner: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: colors.darkGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  heroLabel: {
    fontSize: 12,
    letterSpacing: 1,
    color: colors.mutedLight,
  },
  textBlock: {
    marginTop: 32,
  },
  heading: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.darkGreen,
    lineHeight: 36,
  },
  highlight: {
    backgroundColor: colors.green,
    borderRadius: 8,
  },
  subtitle: {
    marginTop: 12,
    fontSize: 15,
    color: colors.muted,
    lineHeight: 21,
  },
  button: {
    marginTop: 24,
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
  loginRow: {
    marginTop: 16,
    textAlign: "center",
    fontSize: 14,
    color: "#5c6b52",
  },
  loginLink: {
    color: colors.darkGreen,
    fontWeight: "700",
  },
});
