import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../i18n/LanguageContext';
import type { Language } from '../i18n/translations';
import { BankCardIcon, PiggyBankIcon } from '../components/icons';
import { accounts, cards, getNetWorth } from '../data/wallet';
import { formatCurrency } from '../utils/format';
import { showComingSoonAlert } from '../utils/comingSoon';
import { colors } from '../theme';

function resolveText(value: string | { en: string; pt: string }, language: Language): string {
  return typeof value === 'string' ? value : value[language];
}

export default function Wallet() {
  const { t, language } = useLanguage();
  const netWorth = getNetWorth();

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{t.wallet.title}</Text>
          <Text style={styles.subtitle}>{t.wallet.subtitle}</Text>
        </View>
        <TouchableOpacity style={styles.iconButton} onPress={() => showComingSoonAlert(t.common)}>
          <BankCardIcon size={18} color={colors.darkGreen} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.netWorthCard}>
          <Text style={styles.netWorthLabel}>{t.wallet.netWorth}</Text>
          <Text style={styles.netWorthAmount}>{formatCurrency(netWorth, language)}</Text>
        </View>

        <Text style={styles.sectionTitle}>{t.wallet.accounts}</Text>
        <View style={styles.list}>
          {accounts.map((account) => (
            <View key={account.id} style={styles.row}>
              <View style={styles.iconBox}>
                {account.type === 'savings' ? (
                  <PiggyBankIcon size={18} color={colors.darkGreen} />
                ) : (
                  <BankCardIcon size={18} color={colors.darkGreen} />
                )}
              </View>
              <View style={styles.rowMain}>
                <Text style={styles.rowTitle}>{resolveText(account.name, language)}</Text>
                <Text style={styles.rowSubtitle}>{resolveText(account.subtitle, language)}</Text>
              </View>
              <Text style={styles.rowAmount}>{formatCurrency(account.balance, language)}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>{t.wallet.cards}</Text>
        <View style={styles.list}>
          {cards.map((card) => {
            const usedPercent = Math.round((card.currentInvoice / card.limit) * 100);
            return (
              <View key={card.id}>
                <View style={styles.row}>
                  <View style={styles.iconBox}>
                    <BankCardIcon size={18} color={colors.darkGreen} />
                  </View>
                  <View style={styles.rowMain}>
                    <Text style={styles.rowTitle}>{resolveText(card.name, language)}</Text>
                    <Text style={styles.rowSubtitle}>{resolveText(card.subtitle, language)}</Text>
                  </View>
                  <Text style={styles.rowAmount}>
                    {usedPercent}% {t.wallet.used}
                  </Text>
                </View>

                <View style={styles.invoiceBox}>
                  <View style={styles.invoiceRow}>
                    <Text style={styles.invoiceLabel}>{t.wallet.invoiceLabel}</Text>
                    <Text style={styles.invoiceAmount}>
                      {formatCurrency(card.currentInvoice, language)} /{' '}
                      {formatCurrency(card.limit, language)}
                    </Text>
                  </View>
                  <View style={styles.invoiceTrack}>
                    <View
                      style={[styles.invoiceFill, { width: `${Math.min(100, usedPercent)}%` }]}
                    />
                  </View>
                </View>
              </View>
            );
          })}
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
  iconButton: {
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
  netWorthCard: {
    marginTop: 12,
    backgroundColor: colors.darkGreen,
    borderRadius: 20,
    padding: 20,
  },
  netWorthLabel: {
    color: '#c7dcb8',
    fontSize: 13,
  },
  netWorthAmount: {
    color: '#ffffff',
    fontSize: 34,
    fontWeight: '800',
    marginTop: 6,
  },
  sectionTitle: {
    marginTop: 22,
    fontSize: 15,
    fontWeight: '700',
    color: colors.darkGreen,
  },
  list: {
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2ec',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.heroBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowMain: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.darkGreen,
  },
  rowSubtitle: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  rowAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.darkGreen,
  },
  invoiceBox: {
    marginTop: 4,
    marginBottom: 8,
  },
  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  invoiceLabel: {
    fontSize: 12,
    color: colors.muted,
  },
  invoiceAmount: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.darkGreen,
  },
  invoiceTrack: {
    marginTop: 8,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#eef1ea',
    overflow: 'hidden',
  },
  invoiceFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: colors.green,
  },
});
