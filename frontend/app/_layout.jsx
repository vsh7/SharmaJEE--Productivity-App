import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { useColorScheme } from '../hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    const setRootBackgroundColor = async () => {
      const backgroundColor = colorScheme === 'dark' ? '#0F172A' : '#F3F4F6';
      await SystemUI.setBackgroundColorAsync(backgroundColor);
    };

    setRootBackgroundColor();
  }, [colorScheme]);

  const CustomDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#0F172A',
    },
  };

  const CustomLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#F3F4F6',
    },
  };

  return (
    <ThemeProvider value={colorScheme === 'dark' ? CustomDarkTheme : CustomLightTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          animationDuration: 250,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          contentStyle: {
            backgroundColor: colorScheme === 'dark' ? '#0F172A' : '#F3F4F6',
          },
        }}
      />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
