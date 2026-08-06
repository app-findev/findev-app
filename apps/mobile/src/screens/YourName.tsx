import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Svg, { Path, Circle } from 'react-native-svg';
import LanguageToggle from '../components/LanguageToggle';
import { useLanguage } from '../i18n/LanguageContext';
import { colors } from '../theme';
import type { RootStackParamList } from '../navigation/types';

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

function InfoIcon() {
  return (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={colors.darkGreen} strokeWidth={1.8} />
      <Path d="M12 11v5" stroke={colors.darkGreen} strokeWidth={1.8} strokeLinecap="round" />
      <Circle cx="12" cy="8" r="1" fill={colors.darkGreen} />
    </Svg>
  );
}

type Props = NativeStackScreenProps<RootStackParamList, 'YourName'>;

export default function YourName({ navigation }: Props) {
  const { t } = useLanguage();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const canContinue = firstName.trim().length > 0;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.stepLabel}>{t.yourName.step}</Text>
        <LanguageToggle />
      </View>

      <View style={styles.progressRow}>
        <View style={[styles.progressSegment, styles.progressDone]} />
        <View style={[styles.progressSegment, styles.progressActive]} />
        <View style={styles.progressSegment} />
        <View style={styles.progressSegment} />
      </View>

      <Text style={styles.heading}>{t.yourName.heading}</Text>
      <Text style={styles.subtitle}>{t.yourName.subtitle}</Text>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>{t.yourName.firstName}</Text>
        <TextInput
          placeholder="Alex"
          placeholderTextColor={colors.mutedLight}
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>{t.yourName.lastName}</Text>
        <TextInput
          placeholder="Rivera"
          placeholderTextColor={colors.mutedLight}
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
        />
      </View>

      <View style={styles.infoBox}>
        <InfoIcon />
        <Text style={styles.infoText}>{t.yourName.infoText}</Text>
      </View>

      <View style={{ flex: 1 }} />

      <TouchableOpacity
        style={[styles.button, !canContinue && styles.buttonDisabled]}
        disabled={!canContinue}
        onPress={() => navigation.navigate('Goals')}
      >
        <Text style={styles.buttonText}>{t.yourName.continue} →</Text>
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
    fontSize: 26,
    fontWeight: '800',
    color: colors.darkGreen,
    marginTop: 28,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: colors.muted,
  },
  fieldGroup: {
    marginTop: 24,
  },
  label: {
    fontSize: 13,
    color: '#5c6b52',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
    fontSize: 15,
    color: colors.darkGreen,
    backgroundColor: colors.inputBg,
  },
  infoBox: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: colors.heroBg,
    borderRadius: 14,
    padding: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.darkGreen,
    lineHeight: 19,
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
