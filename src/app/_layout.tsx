import {
  CormorantGaramond_500Medium,
  CormorantGaramond_500Medium_Italic,
  CormorantGaramond_600SemiBold,
} from '@expo-google-fonts/cormorant-garamond';
import {
  EBGaramond_400Regular,
  EBGaramond_400Regular_Italic,
  EBGaramond_500Medium,
} from '@expo-google-fonts/eb-garamond';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ReadingProvider } from '@/state/reading';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    CormorantGaramond_600SemiBold,
    CormorantGaramond_500Medium,
    CormorantGaramond_500Medium_Italic,
    EBGaramond_400Regular,
    EBGaramond_500Medium,
    EBGaramond_400Regular_Italic,
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ReadingProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#0a0e24' },
              animation: 'fade',
              animationDuration: 260,
            }}
          />
        </ReadingProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
