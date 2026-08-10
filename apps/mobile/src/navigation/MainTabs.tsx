import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import Insights from '../screens/Insights';
import Wallet from '../screens/Wallet';
import Profile from '../screens/Profile';
import { HomeTabIcon, InsightsTabIcon, WalletTabIcon, ProfileTabIcon } from '../components/icons';
import { useLanguage } from '../i18n/LanguageContext';
import { colors } from '../theme';
import type { MainTabsParamList } from './types';

const Tab = createBottomTabNavigator<MainTabsParamList>();

export default function MainTabs() {
  const { t } = useLanguage();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.darkGreen,
        tabBarInactiveTintColor: colors.mutedLight,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarStyle: { height: 64, paddingTop: 6, paddingBottom: 8 },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={Home}
        options={{
          title: t.tabs.home,
          tabBarIcon: ({ color, size }) => <HomeTabIcon color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="InsightsTab"
        component={Insights}
        options={{
          title: t.tabs.insights,
          tabBarIcon: ({ color, size }) => <InsightsTabIcon color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="WalletTab"
        component={Wallet}
        options={{
          title: t.tabs.wallet,
          tabBarIcon: ({ color, size }) => <WalletTabIcon color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={Profile}
        options={{
          title: t.tabs.profile,
          tabBarIcon: ({ color, size }) => <ProfileTabIcon color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
