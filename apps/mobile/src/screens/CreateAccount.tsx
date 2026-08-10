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

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
        stroke={colors.muted}
        strokeWidth={2}
      />
      <Circle cx="12" cy="12" r="3" stroke={colors.muted} strokeWidth={2} />
    </Svg>
  ) : (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.24 4.24M9.9 4.24A10.8 10.8 0 0 1 12 4c6.5 0 10 7 10 7a13.4 13.4 0 0 1-3.17 4.13M6.5 6.5C4 8.1 2 12 2 12s3.5 7 10 7c1.4 0 2.67-.31 3.8-.82"
        stroke={colors.muted}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CheckIcon() {
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

type Props = NativeStackScreenProps<RootStackParamList, 'CreateAccount'>;

export default function CreateAccount({ navigation }: Props) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const passwordValid = password.length >= 8;
  const emailValid = /\S+@\S+\.\S+/.test(email);
  const canContinue = emailValid && passwordValid;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.stepLabel}>{t.createAccount.step}</Text>
        <LanguageToggle />
      </View>

      <View style={styles.progressRow}>
        <View style={[styles.progressSegment, styles.progressActive]} />
        <View style={styles.progressSegment} />
        <View style={styles.progressSegment} />
        <View style={styles.progressSegment} />
      </View>

      <Text style={styles.heading}>{t.createAccount.heading}</Text>
      <Text style={styles.subtitle}>{t.createAccount.subtitle}</Text>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>{t.createAccount.email}</Text>
        <TextInput
          placeholder="alex@example.com"
          placeholderTextColor={colors.mutedLight}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>{t.createAccount.password}</Text>
        <View style={styles.passwordWrapper}>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={[styles.input, { paddingRight: 44 }]}
          />
          <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword((v) => !v)}>
            <EyeIcon open={showPassword} />
          </TouchableOpacity>
        </View>

        <View style={styles.checkRow}>
          <View style={[styles.checkBox, passwordValid && styles.checkBoxActive]}>
            {passwordValid && <CheckIcon />}
          </View>
          <Text style={[styles.checkText, passwordValid && styles.checkTextActive]}>
            {t.createAccount.passwordHint}
            {passwordValid ? t.createAccount.passwordHintValid : ''}
          </Text>
        </View>
      </View>

      <View style={{ flex: 1 }} />

      <TouchableOpacity
        style={[styles.button, !canContinue && styles.buttonDisabled]}
        disabled={!canContinue}
        onPress={() => navigation.navigate('YourName')}
      >
        <Text style={styles.buttonText}>{t.createAccount.continue} →</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        {t.createAccount.agreement} <Text style={styles.footerLink}>{t.createAccount.terms}</Text>{' '}
        {t.createAccount.and} <Text style={styles.footerLink}>{t.createAccount.privacyPolicy}</Text>
        .
      </Text>
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
  passwordWrapper: {
    justifyContent: 'center',
  },
  eyeButton: {
    position: 'absolute',
    right: 14,
    height: '100%',
    justifyContent: 'center',
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
  },
  checkBox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    backgroundColor: colors.track,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBoxActive: {
    backgroundColor: colors.darkGreen,
  },
  checkText: {
    fontSize: 13,
    color: colors.mutedLight,
  },
  checkTextActive: {
    color: colors.darkGreen,
    fontWeight: '600',
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
  footer: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 12,
    color: colors.mutedLight,
    lineHeight: 18,
  },
  footerLink: {
    color: '#5c6b52',
    fontWeight: '700',
  },
});
