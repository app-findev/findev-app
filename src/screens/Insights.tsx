import { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../i18n/LanguageContext';
import { useExpenses } from '../context/ExpensesContext';
import { CalendarIcon, type IconProps } from '../components/icons';
import Svg, { Path } from 'react-native-svg';
import { formatCurrency, getLocale } from '../utils/format';
import { showComingSoonAlert } from '../utils/comingSoon';
import { CATEGORY_COLORS, CATEGORY_ORDER, type CategoryKey } from '../data/categories';
import { colors } from '../theme';

// Mock spending history, expressed relative to the current month so it
// never goes stale as the real current month changes.
const PAST_MONTHS = [
  { monthsAgo: 3, amount: 2100 },
  { monthsAgo: 2, amount: 1950 },
  { monthsAgo: 1, amount: 2660 },
];

function ArrowUpIcon({ size = 16, color = colors.darkGreen }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 19V5M6 11l6-6 6 6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ArrowDownIcon({ size = 16, color = colors.darkGreen }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 5v14M6 13l6 6 6-6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function Insights() {
  const { t, language } = useLanguage();
  const { expenses } = useExpenses();
  const locale = getLocale(language);

  const currentMonthDate = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }, []);
  const currentMonthName = currentMonthDate
    .toLocaleDateString(locale, { month: 'long' })
    .replace(/^\w/, (c) => c.toUpperCase());

  const currentTotal = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);

  const months = useMemo(() => {
    const historical = PAST_MONTHS.map((m) => ({
      label: new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - m.monthsAgo, 1)
        .toLocaleDateString(locale, { month: 'short' })
        .replace('.', '')
        .replace(/^\w/, (c) => c.toUpperCase()),
      amount: m.amount,
      active: false,
    }));
    return [
      ...historical,
      {
        label: currentMonthName.slice(0, 3),
        amount: currentTotal,
        active: true,
      },
    ];
  }, [currentTotal, locale, currentMonthName, currentMonthDate]);

  const maxMonthAmount = Math.max(...months.map((m) => m.amount));

  const previousMonth = PAST_MONTHS[PAST_MONTHS.length - 1];
  const previousMonthName = new Date(
    currentMonthDate.getFullYear(),
    currentMonthDate.getMonth() - previousMonth.monthsAgo,
    1
  )
    .toLocaleDateString(locale, { month: 'long' })
    .replace(/^\w/, (c) => c.toUpperCase());
  const percentChange = ((currentTotal - previousMonth.amount) / previousMonth.amount) * 100;

  const categoryTotals = useMemo(() => {
    const totals: Partial<Record<CategoryKey, number>> = {};
    for (const e of expenses) {
      const cat = e.category ?? 'other';
      totals[cat] = (totals[cat] ?? 0) + e.amount;
    }
    return CATEGORY_ORDER.map((key) => ({
      key,
      amount: totals[key] ?? 0,
    })).filter((c) => c.amount > 0);
  }, [expenses]);

  const topCategory = categoryTotals.reduce<{ key: CategoryKey; amount: number } | null>(
    (max, c) => (c.amount > (max?.amount ?? 0) ? c : max),
    null
  );
  const maxCategoryAmount = Math.max(...categoryTotals.map((c) => c.amount), 1);

  const insightText =
    percentChange >= 0
      ? t.insights.increaseInsight
          .replace('{percent}', Math.round(percentChange).toString())
          .replace('{month}', previousMonthName)
          .replace('{category}', topCategory ? t.categories[topCategory.key] : '')
      : t.insights.decreaseInsight
          .replace('{percent}', Math.round(Math.abs(percentChange)).toString())
          .replace('{month}', previousMonthName);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{t.insights.title}</Text>
          <Text style={styles.subtitle}>
            {t.insights.subtitle.replace('{month}', currentMonthName)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.calendarButton}
          onPress={() => showComingSoonAlert(t.common)}
        >
          <CalendarIcon size={18} color={colors.darkGreen} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>{t.insights.totalLabel}</Text>
          <Text style={styles.totalAmount}>{formatCurrency(currentTotal, language)}</Text>

          <View style={styles.barsRow}>
            {months.map((m, idx) => (
              <View key={idx} style={styles.barColumn}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${Math.max(8, (m.amount / maxMonthAmount) * 100)}%`,
                      },
                      m.active ? styles.barActive : styles.barInactive,
                    ]}
                  />
                </View>
                <Text style={[styles.barLabel, m.active && styles.barLabelActive]}>{m.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.insightBox}>
          {percentChange >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
          <Text style={styles.insightText}>{insightText}</Text>
        </View>

        <Text style={styles.sectionTitle}>{t.insights.byCategory}</Text>

        <View style={styles.categoryList}>
          {categoryTotals.map((c) => (
            <View key={c.key} style={styles.categoryRow}>
              <View style={styles.categoryHeaderRow}>
                <View style={[styles.categoryDot, { backgroundColor: CATEGORY_COLORS[c.key] }]} />
                <Text style={styles.categoryName}>{t.categories[c.key]}</Text>
                <View style={{ flex: 1 }} />
                <Text style={styles.categoryAmount}>{formatCurrency(c.amount, language)}</Text>
              </View>
              <View style={styles.categoryTrack}>
                <View
                  style={[
                    styles.categoryFill,
                    {
                      width: `${(c.amount / maxCategoryAmount) * 100}%`,
                      backgroundColor: CATEGORY_COLORS[c.key],
                    },
                  ]}
                />
              </View>
            </View>
          ))}
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
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.darkGreen,
  },
  subtitle: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 2,
  },
  calendarButton: {
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
  totalCard: {
    marginTop: 12,
    backgroundColor: colors.darkGreen,
    borderRadius: 20,
    padding: 20,
  },
  totalLabel: {
    color: '#c7dcb8',
    fontSize: 13,
  },
  totalAmount: {
    color: '#ffffff',
    fontSize: 34,
    fontWeight: '800',
    marginTop: 6,
  },
  barsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    height: 64,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
  },
  barTrack: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 8,
  },
  barActive: {
    backgroundColor: colors.green,
  },
  barInactive: {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  barLabel: {
    marginTop: 8,
    fontSize: 12,
    color: '#8ea87c',
  },
  barLabelActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  insightBox: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: colors.heroBg,
    borderRadius: 14,
    padding: 14,
  },
  insightText: {
    flex: 1,
    fontSize: 13,
    color: colors.darkGreen,
    lineHeight: 19,
  },
  sectionTitle: {
    marginTop: 22,
    fontSize: 15,
    fontWeight: '700',
    color: colors.darkGreen,
  },
  categoryList: {
    marginTop: 12,
    gap: 16,
  },
  categoryRow: {
    gap: 8,
  },
  categoryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.darkGreen,
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.darkGreen,
  },
  categoryTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: '#eef1ea',
    overflow: 'hidden',
  },
  categoryFill: {
    height: '100%',
    borderRadius: 3,
  },
});
