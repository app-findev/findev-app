import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import TrendIcon from '../components/TrendIcon';
import { useLanguage } from '../i18n/LanguageContext';
import { formatCurrency } from '../utils/format';
import { showComingSoonAlert } from '../utils/comingSoon';
import { colors } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Paywall'>;

type PlanId = 'annual' | 'monthly';

const PLANS: Record<PlanId, { pricePerMonth: number }> = {
  annual: { pricePerMonth: 9.9 },
  monthly: { pricePerMonth: 19.9 },
};

export default function Paywall({ navigation }: Props) {
  const { t, language } = useLanguage();
  const [selected, setSelected] = useState<PlanId>('annual');

  const showComingSoon = () => showComingSoonAlert(t.common);

  const handleContinue = () => {
    Alert.alert(t.paywall.successTitle, t.paywall.successMessage, [
      { text: t.paywall.ok, onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.logoBox}>
        <TrendIcon size={28} color="#8fe05a" />
      </View>

      <Text style={styles.heading}>
        {t.paywall.heading1}
        {'\n'}
        {t.paywall.heading2}
      </Text>
      <Text style={styles.subtitle}>{t.paywall.subtitle}</Text>

      <TouchableOpacity
        style={[styles.planCard, selected === 'annual' && styles.planCardActive]}
        onPress={() => setSelected('annual')}
      >
        <View style={styles.saveBadge}>
          <Text style={styles.saveBadgeText}>{t.paywall.saveBadge}</Text>
        </View>

        <View style={styles.planHeaderRow}>
          <View>
            <Text style={styles.planName}>{t.paywall.annual}</Text>
            <View style={styles.planPriceRow}>
              <Text style={styles.planPrice}>
                {formatCurrency(PLANS.annual.pricePerMonth, language)}
              </Text>
              <Text style={styles.planPricePeriod}>{t.paywall.perMonth}</Text>
            </View>
          </View>
          <View style={[styles.radioOuter, selected === 'annual' && styles.radioOuterActive]}>
            {selected === 'annual' && <View style={styles.radioInner} />}
          </View>
        </View>

        <View style={styles.featureList}>
          <Text style={styles.featureItem}>✓ {t.paywall.featureInsights}</Text>
          <Text style={styles.featureItem}>✓ {t.paywall.featureGoals}</Text>
          <Text style={styles.featureItem}>✓ {t.paywall.featureExport}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.planCard, selected === 'monthly' && styles.planCardActive]}
        onPress={() => setSelected('monthly')}
      >
        <View style={styles.planHeaderRow}>
          <View>
            <Text style={styles.planName}>{t.paywall.monthly}</Text>
            <View style={styles.planPriceRow}>
              <Text style={styles.planPrice}>
                {formatCurrency(PLANS.monthly.pricePerMonth, language)}
              </Text>
              <Text style={styles.planPricePeriod}>{t.paywall.perMonth}</Text>
            </View>
          </View>
          <View style={[styles.radioOuter, selected === 'monthly' && styles.radioOuterActive]}>
            {selected === 'monthly' && <View style={styles.radioInner} />}
          </View>
        </View>
      </TouchableOpacity>

      <View style={{ flex: 1 }} />

      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>{t.paywall.continue} →</Text>
      </TouchableOpacity>

      <View style={styles.linksRow}>
        <TouchableOpacity onPress={showComingSoon}>
          <Text style={styles.linkText}>{t.paywall.restorePurchase}</Text>
        </TouchableOpacity>
        <Text style={styles.linkDivider}>·</Text>
        <TouchableOpacity onPress={showComingSoon}>
          <Text style={styles.linkText}>{t.paywall.terms}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.freeText}>
          {t.paywall.continueFree} <Text style={styles.freeTextBold}>{t.paywall.freeVersion}</Text>
        </Text>
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
    paddingBottom: 16,
    alignItems: 'center',
  },
  logoBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.darkGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  heading: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: '800',
    color: colors.darkGreen,
    textAlign: 'center',
    lineHeight: 30,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  planCard: {
    marginTop: 20,
    width: '100%',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
    backgroundColor: '#ffffff',
    padding: 18,
    position: 'relative',
  },
  planCardActive: {
    borderColor: colors.green,
    backgroundColor: '#eef7e6',
  },
  saveBadge: {
    position: 'absolute',
    top: -12,
    left: 16,
    backgroundColor: colors.green,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  saveBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.darkGreen,
  },
  planHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  planName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.darkGreen,
    marginTop: 6,
  },
  planPriceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 4,
    gap: 3,
  },
  planPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.darkGreen,
  },
  planPricePeriod: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 3,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: {
    backgroundColor: colors.darkGreen,
    borderColor: colors.darkGreen,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
  featureList: {
    marginTop: 14,
    gap: 8,
  },
  featureItem: {
    fontSize: 13,
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
  buttonText: {
    color: colors.darkGreen,
    fontSize: 16,
    fontWeight: '700',
  },
  linksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
  },
  linkText: {
    fontSize: 13,
    color: colors.muted,
  },
  linkDivider: {
    fontSize: 13,
    color: colors.muted,
  },
  freeText: {
    marginTop: 10,
    marginBottom: 8,
    fontSize: 13,
    color: colors.muted,
  },
  freeTextBold: {
    fontWeight: '700',
    color: colors.darkGreen,
  },
});
