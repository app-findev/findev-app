import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
import LanguageToggle from '../components/LanguageToggle';
import { useLanguage } from '../i18n/LanguageContext';
import { colors } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type IconProps = {
  color: string;
};

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

function CheckBadgeIcon() {
  return (
    <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 13l4 4L19 7"
        stroke="#ffffff"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function SavingsIcon({ color }: IconProps) {
  return (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 12c0-3.5 3-6 7-6 3 0 5 1.4 6 3h2l1 2-1.5 1v2l-1.5 1.5H15l-1 2H9l-.5-2C6 15.5 4 14 4 12Z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <Circle cx="16" cy="10.5" r="0.8" fill={color} />
    </Svg>
  );
}

function CardIcon({ color }: IconProps) {
  return (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="6" width="18" height="13" rx="2.2" stroke={color} strokeWidth={1.6} />
      <Line x1="3" y1="10.5" x2="21" y2="10.5" stroke={color} strokeWidth={1.6} />
    </Svg>
  );
}

function TrendIconSmall({ color }: IconProps) {
  return (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 17l6-6 4 4 8-8"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15 7h6v6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CoinIcon({ color }: IconProps) {
  return (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth={1.6} />
      <Path
        d="M12 8.5v7M9.8 10.3c0-1 1-1.8 2.2-1.8s2.2.6 2.2 1.5c0 2-4.4 1-4.4 3 0 .9 1 1.5 2.2 1.5s2.2-.5 2.2-1.5"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function LoopIcon({ color }: IconProps) {
  return (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 9a8 8 0 0 1 14-4.5M20 15a8 8 0 0 1-14 4.5"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <Path
        d="M18 3v4.5h-4.5M6 21v-4.5h4.5"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ClockIcon({ color }: IconProps) {
  return (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth={1.6} />
      <Path
        d="M12 7.5V12l3 2"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

type GoalId = 'savings' | 'debt' | 'spending' | 'investing' | 'subscriptions' | 'budget';

type Goal = {
  id: GoalId;
  Icon: (props: IconProps) => React.JSX.Element;
};

const GOAL_ITEMS: Goal[] = [
  { id: 'savings', Icon: SavingsIcon },
  { id: 'debt', Icon: CardIcon },
  { id: 'spending', Icon: TrendIconSmall },
  { id: 'investing', Icon: CoinIcon },
  { id: 'subscriptions', Icon: LoopIcon },
  { id: 'budget', Icon: ClockIcon },
];

type Props = NativeStackScreenProps<RootStackParamList, 'Goals'>;

export default function Goals({ navigation }: Props) {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<GoalId[]>(['savings', 'debt']);

  const toggle = (id: GoalId) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]));

  const canContinue = selected.length > 0;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.stepLabel}>{t.goals.step}</Text>
        <LanguageToggle />
      </View>

      <View style={styles.progressRow}>
        <View style={[styles.progressSegment, styles.progressDone]} />
        <View style={[styles.progressSegment, styles.progressDone]} />
        <View style={[styles.progressSegment, styles.progressActive]} />
        <View style={styles.progressSegment} />
      </View>

      <Text style={styles.heading}>{t.goals.heading}</Text>
      <Text style={styles.subtitle}>{t.goals.subtitle}</Text>

      <View style={styles.grid}>
        {GOAL_ITEMS.map(({ id, Icon }) => {
          const active = selected.includes(id);
          return (
            <TouchableOpacity
              key={id}
              style={[styles.card, active && styles.cardActive]}
              onPress={() => toggle(id)}
              activeOpacity={0.8}
            >
              {active && (
                <View style={styles.checkBadge}>
                  <CheckBadgeIcon />
                </View>
              )}
              <View
                style={[styles.iconBox, active ? styles.iconBoxActive : styles.iconBoxInactive]}
              >
                <Icon color={active ? '#ffffff' : colors.darkGreen} />
              </View>
              <Text style={styles.cardLabel}>{t.goals[id]}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={{ flex: 1 }} />

      <Text style={styles.selectionText}>
        {selected.length} {t.goals.selected} · {t.goals.pickAtLeastOne}
      </Text>

      <TouchableOpacity
        style={[styles.button, !canContinue && styles.buttonDisabled]}
        disabled={!canContinue}
        onPress={() => navigation.navigate('Budget')}
      >
        <Text style={styles.buttonText}>{t.goals.continue} →</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#f0f2ec',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLabel: {
    fontSize: 14,
    color: colors.mutedLight,
  },
  progressRow: {
    flexDirection: 'row',
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
    fontWeight: '800',
    color: colors.darkGreen,
    marginTop: 28,
    lineHeight: 30,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: colors.muted,
  },
  grid: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '47%',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
    backgroundColor: '#ffffff',
    padding: 16,
    position: 'relative',
  },
  cardActive: {
    borderColor: colors.green,
    backgroundColor: '#eef7e6',
  },
  checkBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.darkGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconBoxActive: {
    backgroundColor: colors.darkGreen,
  },
  iconBoxInactive: {
    backgroundColor: colors.heroBg,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.darkGreen,
  },
  selectionText: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: colors.darkGreen,
    marginBottom: 12,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: colors.darkGreen,
    fontSize: 16,
    fontWeight: '700',
  },
});
