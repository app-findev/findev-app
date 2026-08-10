import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import {
  ChevronLeftIcon,
  CalendarIcon,
  RepeatIcon,
  LayersIcon,
  CheckBadgeSmallIcon,
  TrashIcon,
} from '../components/icons';
import { useLanguage } from '../i18n/LanguageContext';
import { useExpenses } from '../context/ExpensesContext';
import type { ExpenseTag } from '../data/mockExpenses';
import { formatCurrency, formatDate, formatAmountFromCents } from '../utils/format';
import { colors } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'EditExpense'>;

export default function EditExpense({ navigation, route }: Props) {
  const { t, language } = useLanguage();
  const { expenses, updateExpense, removeExpense } = useExpenses();

  const expense = expenses.find((e) => e.id === route.params.expenseId);

  const [amountCents, setAmountCents] = useState(Math.round((expense?.amount ?? 0) * 100));
  const [description, setDescription] = useState(expense?.title?.[language] ?? '');
  const [dueDate, setDueDate] = useState(expense?.date ?? new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [type, setType] = useState<ExpenseTag>(expense?.tag ?? 'fixed');
  const [current, setCurrent] = useState(expense?.installment?.current ?? 1);
  // Total installment count doesn't change while editing, so it's a plain
  // constant rather than state.
  const total = expense?.installment?.total ?? 2;

  if (!expense) {
    return (
      <SafeAreaView style={styles.screen}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeftIcon size={18} color={colors.darkGreen} />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleAmountChange = (text: string) => {
    const digits = text.replace(/\D/g, '');
    setAmountCents(digits === '' ? 0 : parseInt(digits, 10));
  };

  const handleDateChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setDueDate(selectedDate);
  };

  const canSave = description.trim().length > 0 && amountCents > 0;

  const remaining = Math.max(0, total - current);
  const amount = amountCents / 100;
  const remainingTotal = remaining * amount;

  const handleSave = () => {
    if (!canSave) return;
    updateExpense(expense.id, {
      title: { ...expense.title, [language]: description },
      amount,
      date: dueDate,
      tag: type,
      installment: type === 'installment' ? { current, total } : undefined,
    });
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert(t.editExpense.deleteConfirmTitle, t.editExpense.deleteConfirmMessage, [
      { text: t.editExpense.cancel, style: 'cancel' },
      {
        text: t.editExpense.delete,
        style: 'destructive',
        onPress: () => {
          removeExpense(expense.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeftIcon size={18} color={colors.darkGreen} />
        </TouchableOpacity>
        <Text style={styles.title}>{t.editExpense.title}</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.amountBlock}>
        <Text style={styles.amountLabel}>{t.addExpense.amountLabel}</Text>
        <View style={styles.amountRow}>
          <Text style={styles.amountSign}>{language === 'pt' ? 'R$' : '$'}</Text>
          <TextInput
            style={styles.amountInput}
            value={formatAmountFromCents(amountCents, language)}
            onChangeText={handleAmountChange}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>{t.addExpense.description}</Text>
        <TextInput style={styles.input} value={description} onChangeText={setDescription} />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>{t.addExpense.dueDate}</Text>
        <TouchableOpacity style={styles.dateField} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateText}>{formatDate(dueDate, language)}</Text>
          <CalendarIcon size={18} color={colors.darkGreen} />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={dueDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>{t.addExpense.type}</Text>
        <View style={styles.typeRow}>
          <TouchableOpacity
            style={[styles.typeCard, type === 'fixed' && styles.typeCardActive]}
            onPress={() => setType('fixed')}
          >
            {type === 'fixed' && (
              <View style={styles.checkBadge}>
                <CheckBadgeSmallIcon />
              </View>
            )}
            <View
              style={[
                styles.typeIconBox,
                type === 'fixed' ? styles.typeIconBoxActive : styles.typeIconBoxInactive,
              ]}
            >
              <RepeatIcon size={16} color={type === 'fixed' ? '#ffffff' : colors.darkGreen} />
            </View>
            <Text style={styles.typeLabel}>{t.addExpense.fixed}</Text>
            <Text style={styles.typeSubtitle}>{t.addExpense.fixedSubtitle}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typeCard, type === 'installment' && styles.typeCardActive]}
            onPress={() => setType('installment')}
          >
            {type === 'installment' && (
              <View style={styles.checkBadge}>
                <CheckBadgeSmallIcon />
              </View>
            )}
            <View
              style={[
                styles.typeIconBox,
                type === 'installment' ? styles.typeIconBoxActive : styles.typeIconBoxInactive,
              ]}
            >
              <LayersIcon size={16} color={type === 'installment' ? '#ffffff' : colors.darkGreen} />
            </View>
            <Text style={styles.typeLabel}>{t.addExpense.installment}</Text>
            <Text style={styles.typeSubtitle}>{t.addExpense.installmentSubtitle}</Text>
          </TouchableOpacity>
        </View>

        {type === 'installment' && (
          <View style={styles.stepperRow}>
            <Text style={styles.stepperLabel}>{t.editExpense.currentInstallment}</Text>
            <View style={styles.stepper}>
              <TouchableOpacity
                style={styles.stepperButton}
                onPress={() => setCurrent((v) => Math.max(1, v - 1))}
              >
                <Text style={styles.stepperButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.stepperValue}>
                {current} {t.editExpense.of} {total}
              </Text>
              <TouchableOpacity
                style={styles.stepperButton}
                onPress={() => setCurrent((v) => Math.min(total, v + 1))}
              >
                <Text style={styles.stepperButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {type === 'installment' && (
        <View style={styles.infoBox}>
          <LayersIcon size={16} color={colors.darkGreen} />
          <Text style={styles.infoText}>
            {t.editExpense.remainingInfo
              .replace('{remaining}', remaining.toString())
              .replace('{amount}', formatCurrency(amount, language))
              .replace('{total}', formatCurrency(remainingTotal, language))}
          </Text>
        </View>
      )}

      <View style={{ flex: 1 }} />

      <TouchableOpacity
        style={[styles.button, !canSave && styles.buttonDisabled]}
        disabled={!canSave}
        onPress={handleSave}
      >
        <Text style={styles.buttonText}>{t.editExpense.saveButton} →</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <TrashIcon size={16} color={colors.darkGreen} />
        <Text style={styles.deleteButtonText}>{t.editExpense.deleteButton}</Text>
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
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.darkGreen,
  },
  amountBlock: {
    marginTop: 24,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 13,
    color: colors.muted,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 8,
  },
  amountSign: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.darkGreen,
    marginBottom: 10,
  },
  amountInput: {
    fontSize: 44,
    fontWeight: '800',
    color: colors.darkGreen,
    minWidth: 60,
    padding: 0,
  },
  fieldGroup: {
    marginTop: 22,
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
  dateField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.inputBg,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
  },
  dateText: {
    fontSize: 15,
    color: colors.darkGreen,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  typeCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
    backgroundColor: '#ffffff',
    padding: 14,
    position: 'relative',
  },
  typeCardActive: {
    borderColor: colors.green,
    backgroundColor: '#eef7e6',
  },
  checkBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.darkGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  typeIconBoxActive: {
    backgroundColor: colors.darkGreen,
  },
  typeIconBoxInactive: {
    backgroundColor: colors.heroBg,
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.darkGreen,
  },
  typeSubtitle: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 2,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  stepperLabel: {
    fontSize: 13,
    color: '#5c6b52',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  stepperButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: colors.heroBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.darkGreen,
  },
  stepperValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.darkGreen,
    minWidth: 50,
    textAlign: 'center',
  },
  infoBox: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: colors.heroBg,
    borderRadius: 14,
    padding: 14,
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
  deleteButton: {
    marginTop: 12,
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  deleteButtonText: {
    color: colors.darkGreen,
    fontSize: 14,
    fontWeight: '600',
  },
});
