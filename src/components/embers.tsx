/**
 * Drifting embers that rise and fade — the breath of Mount Doom. Gives Mordor a
 * living, smouldering feel.
 */
import { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface EmberSpec {
  key: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
}

function Ember({ spec, color }: { spec: EmberSpec; color: string }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      spec.delay,
      withRepeat(withTiming(1, { duration: spec.duration, easing: Easing.out(Easing.quad) }), -1, false),
    );
  }, [progress, spec.delay, spec.duration]);

  const style = useAnimatedStyle(() => ({
    opacity: progress.value < 0.15 ? progress.value / 0.15 : 1 - (progress.value - 0.15) / 0.85,
    transform: [
      { translateY: -progress.value * 220 },
      { translateX: Math.sin(progress.value * Math.PI * 2) * spec.drift },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          bottom: 0,
          left: `${spec.left}%`,
          width: spec.size,
          height: spec.size,
          borderRadius: spec.size / 2,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
}

export function Embers({ count = 18, color = '#e0603f' }: { count?: number; color?: string }) {
  const embers = useMemo<EmberSpec[]>(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        key: i,
        left: Math.random() * 100,
        size: Math.random() * 3 + 1.5,
        delay: Math.random() * 4000,
        duration: 3600 + Math.random() * 3200,
        drift: 6 + Math.random() * 14,
      })),
    [count],
  );

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {embers.map((e) => (
        <Ember key={e.key} spec={e} color={color} />
      ))}
    </View>
  );
}
