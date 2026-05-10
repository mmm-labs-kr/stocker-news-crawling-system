import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Text, TextInput } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '../src/theme';

type DefaultsCarrier = {
  defaultProps?: { style?: unknown };
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Pretendard': require('../assets/fonts/Pretendard-Regular.otf'),
    'Pretendard-Medium': require('../assets/fonts/Pretendard-Medium.otf'),
    'Pretendard-SemiBold': require('../assets/fonts/Pretendard-SemiBold.otf'),
    'Pretendard-Bold': require('../assets/fonts/Pretendard-Bold.otf'),
  });

  useEffect(() => {
    if (!fontsLoaded) return;
    const TextWithDefaults = Text as unknown as DefaultsCarrier;
    TextWithDefaults.defaultProps = {
      ...(TextWithDefaults.defaultProps ?? {}),
      style: [{ fontFamily: 'Pretendard' }, TextWithDefaults.defaultProps?.style],
    };
    const TextInputWithDefaults = TextInput as unknown as DefaultsCarrier;
    TextInputWithDefaults.defaultProps = {
      ...(TextInputWithDefaults.defaultProps ?? {}),
      style: [{ fontFamily: 'Pretendard' }, TextInputWithDefaults.defaultProps?.style],
    };
  }, [fontsLoaded]);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      })
  );

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.bg.base },
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
