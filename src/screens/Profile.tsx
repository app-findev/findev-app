import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ReactNode } from 'react';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type {
  NativeStackScreenProps,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import TrendIcon from '../components/TrendIcon';
import {
  MenuIcon,
  PersonIcon,
  TargetIcon,
  BellIcon,
  ShieldIcon,
  QuestionIcon,
  LogoutIcon,
  ChevronRightIcon,
  GlobeIcon,
} from '../components/icons';
import { getLocale } from '../utils/format';
import { showComingSoonAlert } from '../utils/comingSoon';
import { colors } from '../theme';
import type { MainTabsParamList, RootStackParamList } from '../navigation/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabsParamList, 'ProfileTab'>,
  NativeStackScreenProps<RootStackParamList>
>;

const MEMBER_SINCE = new Date(2026, 0, 1);

function MenuRow({
  icon,
  label,
  onPress,
  destructive,
}: {
  icon: ReactNode;
  label: string;
  onPress: () => void;
  destructive?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.menuRow} onPress={onPress}>
      <View style={[styles.menuIconBox, destructive && styles.menuIconBoxDestructive]}>{icon}</View>
      <Text style={[styles.menuLabel, destructive && styles.menuLabelDestructive]}>{label}</Text>
      <View style={{ flex: 1 }} />
      {!destructive && <ChevronRightIcon size={16} color={colors.mutedLight} />}
    </TouchableOpacity>
  );
}

export default function Profile({ navigation }: Props) {
  const { t, language } = useLanguage();
  const locale = getLocale(language);

  const monthName = MEMBER_SINCE.toLocaleDateString(locale, {
    month: 'long',
    year: 'numeric',
  }).replace(/^\w/, (c) => c.toUpperCase());

  const showComingSoon = () => showComingSoonAlert(t.common);

  const handleLogout = () => {
    Alert.alert(t.profile.logoutConfirmTitle, t.profile.logoutConfirmMessage, [
      { text: t.profile.cancel, style: 'cancel' },
      {
        text: t.profile.logout,
        style: 'destructive',
        onPress: () =>
          navigation
            .getParent<NativeStackNavigationProp<RootStackParamList>>()
            ?.reset({ index: 0, routes: [{ name: 'Welcome' }] }),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{t.profile.title}</Text>
        <TouchableOpacity style={styles.menuButton} onPress={showComingSoon}>
          <MenuIcon size={18} color={colors.darkGreen} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarBlock}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>A</Text>
          </View>
          <Text style={styles.name}>Alex Rivera</Text>
          <Text style={styles.email}>alex@example.com</Text>
        </View>

        <TouchableOpacity style={styles.memberBox} onPress={() => navigation.navigate('Paywall')}>
          <TrendIcon size={16} color={colors.darkGreen} />
          <Text style={styles.memberText}>
            {t.profile.memberSince
              .replace('{month}', monthName)
              .replace('{plan}', t.profile.freePlan)}
          </Text>
        </TouchableOpacity>

        <View style={styles.menuList}>
          <MenuRow
            icon={<PersonIcon size={18} color={colors.darkGreen} />}
            label={t.profile.editProfile}
            onPress={showComingSoon}
          />
          <MenuRow
            icon={<TargetIcon size={18} color={colors.darkGreen} />}
            label={t.profile.financialGoals}
            onPress={showComingSoon}
          />
          <MenuRow
            icon={<BellIcon size={18} color={colors.darkGreen} />}
            label={t.profile.notifications}
            onPress={showComingSoon}
          />
          <MenuRow
            icon={<ShieldIcon size={18} color={colors.darkGreen} />}
            label={t.profile.security}
            onPress={showComingSoon}
          />
          <MenuRow
            icon={<QuestionIcon size={18} color={colors.darkGreen} />}
            label={t.profile.helpSupport}
            onPress={showComingSoon}
          />

          <View style={styles.languageRow}>
            <View style={styles.menuIconBox}>
              <GlobeIcon size={18} color={colors.darkGreen} />
            </View>
            <Text style={styles.menuLabel}>{t.profile.language}</Text>
            <View style={{ flex: 1 }} />
            <LanguageToggle />
          </View>

          <MenuRow
            icon={<LogoutIcon size={18} color="#c0392b" />}
            label={t.profile.logout}
            onPress={handleLogout}
            destructive
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.darkGreen,
  },
  menuButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#f0f2ec',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  avatarBlock: {
    alignItems: 'center',
    marginTop: 12,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.darkGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
  },
  name: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '800',
    color: colors.darkGreen,
  },
  email: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 2,
  },
  memberBox: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.heroBg,
    borderRadius: 14,
    padding: 14,
  },
  memberText: {
    flex: 1,
    fontSize: 13,
    color: colors.darkGreen,
    lineHeight: 19,
  },
  menuList: {
    marginTop: 22,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2ec',
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.heroBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconBoxDestructive: {
    backgroundColor: '#fbe9e7',
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.darkGreen,
  },
  menuLabelDestructive: {
    color: '#c0392b',
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2ec',
  },
});
