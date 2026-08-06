import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLanguage } from '../i18n/LanguageContext';
import { colors } from '../theme';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={[styles.option, language === 'pt' && styles.optionActive]}
        onPress={() => setLanguage('pt')}
      >
        <Text style={[styles.text, language === 'pt' && styles.textActive]}>PT</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.option, language === 'en' && styles.optionActive]}
        onPress={() => setLanguage('en')}
      >
        <Text style={[styles.text, language === 'en' && styles.textActive]}>EN</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    backgroundColor: '#f0f2ec',
    borderRadius: 10,
    padding: 3,
    gap: 2,
  },
  option: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  optionActive: {
    backgroundColor: colors.darkGreen,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.mutedLight,
  },
  textActive: {
    color: '#ffffff',
  },
});
