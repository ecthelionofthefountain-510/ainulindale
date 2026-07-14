/**
 * A small transient message for a scene — used by the "soon" hotspots so every
 * region shares the same tap-and-hint pattern. Set `text` to show it; it fades
 * itself out and calls `onDone`.
 */
import { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { AppFonts } from '@/theme/fonts';

export function SceneToast({ text, onDone }: { text: string | null; onDone: () => void }) {
  const shown = useSharedValue(0);

  useEffect(() => {
    if (!text) return;
    shown.value = withTiming(1, { duration: 220 });
    const timer = setTimeout(() => {
      shown.value = withTiming(0, { duration: 260 });
      setTimeout(onDone, 280);
    }, 2200);
    return () => clearTimeout(timer);
  }, [text, shown, onDone]);

  const style = useAnimatedStyle(() => ({
    opacity: shown.value,
    transform: [{ translateY: (1 - shown.value) * 12 }],
  }));

  if (!text) return null;

  return (
    <Animated.View pointerEvents="none" style={[styles.toast, style]}>
      <Text style={styles.toastText}>{text}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 60,
    backgroundColor: 'rgba(20,12,7,0.82)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  toastText: { fontFamily: AppFonts.bodyMedium, fontSize: 13, color: '#f2e6c8', textAlign: 'center' },
});
