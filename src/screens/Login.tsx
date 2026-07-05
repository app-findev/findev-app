import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Svg, { Path, Circle } from 'react-native-svg';
import TrendIcon from '../components/TrendIcon';
import LanguageToggle from '../components/LanguageToggle';
import { useLanguage } from '../i18n/LanguageContext';
import { colors } from '../theme';
import type { RootStackParamList } from '../navigation/types';

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

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function Login({ navigation }: Props) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.brandRow}>
        <View style={styles.logoBox}>
          <TrendIcon size={18} />
        </View>
        <Text style={styles.brandName}>SpentLittle</Text>
        <View style={{ flex: 1 }} />
        <LanguageToggle />
      </View>

      <Text style={styles.heading}>{t.login.heading}</Text>
      <Text style={styles.subtitle}>{t.login.subtitle}</Text>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>{t.login.email}</Text>
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
        <Text style={styles.label}>{t.login.password}</Text>
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

        <TouchableOpacity style={styles.forgotButton} onPress={() => {}}>
          <Text style={styles.forgotText}>{t.login.forgotPassword}</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }} />

      <TouchableOpacity style={styles.button} onPress={() => {}}>
        <Text style={styles.buttonText}>{t.login.login} →</Text>
      </TouchableOpacity>

      <Text style={styles.signupRow}>
        {t.login.noAccount}{' '}
        <Text style={styles.signupLink} onPress={() => navigation.navigate('CreateAccount')}>
          {t.login.signUp}
        </Text>
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
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 24,
  },
  logoBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.darkGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.darkGreen,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.darkGreen,
  },
  subtitle: {
    marginTop: 6,
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
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.darkGreen,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.darkGreen,
    fontSize: 16,
    fontWeight: '700',
  },
  signupRow: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 14,
    color: '#5c6b52',
  },
  signupLink: {
    color: colors.darkGreen,
    fontWeight: '700',
  },
});
