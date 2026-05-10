import { Tabs } from 'expo-router';
import { colors } from '../../src/theme';
import { BookmarkIcon, HomeIcon, PersonIcon, SearchIcon } from '../../src/components/common/Icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bg.base,
          borderTopColor: colors.border.subtle,
          paddingTop: 8,
          height: 78,
          paddingBottom: 22,
        },
        tabBarActiveTintColor: colors.text.primary,
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: '탐색',
          tabBarIcon: ({ color }) => <SearchIcon size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="bookmark"
        options={{
          title: '북마크',
          tabBarIcon: ({ color }) => <BookmarkIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          title: '마이',
          tabBarIcon: ({ color }) => <PersonIcon color={color} />,
        }}
      />
      <Tabs.Screen name="news/[id]" options={{ href: null }} />
    </Tabs>
  );
}
