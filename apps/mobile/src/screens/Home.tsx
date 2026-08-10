import { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  TargetIcon,
  CalendarIcon,
  WarningIcon,
  PlusIcon,
  RepeatIcon,
  LayersIcon,
} from '../components/icons';
import { useLanguage } from '../i18n/LanguageContext';
import type { Language } from '../i18n/translations';
import { useExpenses } from '../context/ExpensesContext';
import {
  monthlyGoal,
  getSpentTotal,
  getPendingTotal,
  type Expense,
  type ExpenseTag,
} from '../data/mockExpenses';
import { formatCurrency, getLocale, splitCurrency } from '../utils/format';
import { showComingSoonAlert } from '../utils/comingSoon';
import { colors } from '../theme';
import type { MainTabsParamList, RootStackParamList } from '../navigation/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabsParamList, 'HomeTab'>,
  NativeStackScreenProps<RootStackParamList>
>;

const FILTERS: ('all' | ExpenseTag)[] = ['all', 'fixed', 'installment'];

function ExpenseRow({
  expense,
  language,
  onPress,
}: {
  expense: Expense;
  language: Language;
  onPress: () => void;
}) {
  const { t } = useLanguage();
  const locale = getLocale(language);
  const day = expense.date.getDate().toString().padStart(2, '0');
  const weekday = expense.date.toLocaleDateString(locale, { weekday: 'short' }).replace('.', '');
  const isPaid = expense.status === 'paid';
  const tagLabel =
    expense.tag === 'installment' && expense.installment
      ? `${t.home.installment} ${expense.installment.current}/${expense.installment.total}`
      : t.home.fixed;

  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.dateBadge}>
        <Text style={styles.dateDay}>{day}</Text>
        <Text style={styles.dateWeekday}>{weekday}</Text>
      </View>

      <View style={styles.rowMain}>
        <Text style={styles.rowTitle}>{expense.title[language]}</Text>
        <View style={styles.tagBadge}>
          {expense.tag === 'installment' ? (
            <LayersIcon size={11} color={colors.darkGreen} />
          ) : (
            <RepeatIcon size={11} color={colors.darkGreen} />
          )}
          <Text style={styles.tagText}>{tagLabel}</Text>
        </View>
      </View>

      <View style={styles.rowRight}>
        <Text style={[styles.amount, isPaid && styles.amountPaid]}>
          {formatCurrency(expense.amount, language)}
        </Text>
        <Text style={[styles.status, isPaid && styles.statusPaid]}>
          {isPaid ? t.home.paid : t.home.pending}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function Home({ navigation }: Props) {
  const { t, language } = useLanguage();
  const { expenses } = useExpenses();
  const [filter, setFilter] = useState<'all' | ExpenseTag>('all');
  const [monthOffset, setMonthOffset] = useState(0);

  const locale = getLocale(language);
  const monthDate = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  }, [monthOffset]);
  const monthLabel = monthDate
    .toLocaleDateString(locale, { month: 'long', year: 'numeric' })
    .replace(/^\w/, (c) => c.toUpperCase());

  const spent = getSpentTotal(expenses);
  const pending = getPendingTotal(expenses);
  const untilGoal = monthlyGoal - spent;
  const overage = spent + pending - monthlyGoal;
  const progress = Math.min(100, (spent / monthlyGoal) * 100);

  const filteredExpenses = expenses.filter((e) => {
    if (filter === 'all') return true;
    return e.tag === filter;
  });

  const goalParts = splitCurrency(monthlyGoal, language);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.headerRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>A</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.greeting}>{t.home.greeting.replace('{name}', 'Alex')}</Text>
          <Text style={styles.headerSubtitle}>{t.home.subtitle}</Text>
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
        <View style={styles.goalCard}>
          <View style={styles.monthRow}>
            <TouchableOpacity
              style={styles.monthArrow}
              onPress={() => setMonthOffset((v) => v - 1)}
            >
              <ChevronLeftIcon size={16} />
            </TouchableOpacity>
            <Text style={styles.monthLabel}>{monthLabel}</Text>
            <TouchableOpacity
              style={styles.monthArrow}
              onPress={() => setMonthOffset((v) => v + 1)}
            >
              <ChevronRightIcon size={16} />
            </TouchableOpacity>
          </View>

          <View style={styles.goalLabelRow}>
            <TargetIcon size={14} color="#c7dcb8" />
            <Text style={styles.goalLabel}>{t.home.monthlyGoal}</Text>
          </View>

          <View style={styles.goalAmountRow}>
            <Text style={styles.goalSign}>{goalParts.symbol}</Text>
            <Text style={styles.goalAmount}>{goalParts.amount}</Text>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>

          <View style={styles.goalFooterRow}>
            <Text style={styles.goalFooterText}>
              {formatCurrency(spent, language)} {t.home.spent}
            </Text>
            <Text style={styles.goalFooterText}>
              {formatCurrency(Math.max(0, untilGoal), language)} {t.home.untilGoal}
            </Text>
          </View>
        </View>

        {overage > 0 && (
          <View style={styles.alertBox}>
            <WarningIcon size={18} color={colors.darkGreen} />
            <Text style={styles.alertText}>
              {t.home.pendingAlert.replace('{amount}', formatCurrency(pending, language))}{' '}
              <Text style={styles.alertBold}>
                {t.home.pendingAlertOver.replace('{amount}', formatCurrency(overage, language))}
              </Text>
            </Text>
          </View>
        )}

        <View style={styles.filterRow}>
          {FILTERS.map((f) => {
            const label =
              f === 'all'
                ? t.home.filterAll
                : f === 'fixed'
                  ? t.home.filterFixed
                  : t.home.filterInstallments;
            const active = filter === f;
            return (
              <TouchableOpacity
                key={f}
                style={[styles.filterPill, active && styles.filterPillActive]}
                onPress={() => setFilter(f)}
              >
                <Text style={[styles.filterText, active && styles.filterTextActive]}>{label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.list}>
          {filteredExpenses.map((expense) => (
            <ExpenseRow
              key={expense.id}
              expense={expense}
              language={language}
              onPress={() => navigation.navigate('EditExpense', { expenseId: expense.id })}
            />
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddExpense')}>
        <PlusIcon size={26} color={colors.darkGreen} />
      </TouchableOpacity>
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
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.darkGreen,
    fontWeight: '800',
    fontSize: 16,
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.darkGreen,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 1,
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
    paddingBottom: 100,
  },
  goalCard: {
    marginTop: 12,
    backgroundColor: colors.darkGreen,
    borderRadius: 20,
    padding: 20,
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  monthArrow: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthLabel: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  goalLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 18,
  },
  goalLabel: {
    color: '#c7dcb8',
    fontSize: 13,
  },
  goalAmountRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginTop: 6,
  },
  goalSign: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
  },
  goalAmount: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight: '800',
  },
  progressTrack: {
    marginTop: 18,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: colors.green,
  },
  goalFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  goalFooterText: {
    color: '#c7dcb8',
    fontSize: 12,
  },
  alertBox: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: colors.heroBg,
    borderRadius: 14,
    padding: 14,
  },
  alertText: {
    flex: 1,
    fontSize: 13,
    color: colors.darkGreen,
    lineHeight: 19,
  },
  alertBold: {
    fontWeight: '800',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 18,
  },
  filterPill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f2ec',
  },
  filterPillActive: {
    backgroundColor: colors.darkGreen,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.muted,
  },
  filterTextActive: {
    color: '#ffffff',
  },
  list: {
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2ec',
  },
  dateBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#f5f7f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateDay: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.darkGreen,
  },
  dateWeekday: {
    fontSize: 10,
    color: colors.mutedLight,
    textTransform: 'lowercase',
  },
  rowMain: {
    flex: 1,
    gap: 4,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.darkGreen,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: colors.heroBg,
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.darkGreen,
  },
  rowRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  amount: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.darkGreen,
  },
  amountPaid: {
    color: colors.mutedLight,
    textDecorationLine: 'line-through',
    fontWeight: '500',
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
    color: '#c08a1e',
  },
  statusPaid: {
    color: colors.green,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
});
