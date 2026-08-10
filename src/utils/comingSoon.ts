import { Alert } from 'react-native';

type CommonTranslations = {
  comingSoonTitle: string;
  comingSoonMessage: string;
  ok: string;
};

export function showComingSoonAlert(t: CommonTranslations): void {
  Alert.alert(t.comingSoonTitle, t.comingSoonMessage, [{ text: t.ok }]);
}
