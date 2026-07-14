/**
 * A warm, breathing pool of firelight for a hearth. Pure light — position it
 * over the fireplace in a scene and let it flicker.
 */
import { useEffect } from 'react';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export function HearthGlow({
  left = '10%',
  top = '58%',
  size = 150,
  color = '#ff8a1e',
}: {
  left?: string;
  top?: string;
  size?: number;
  color?: string;
}) {
  const flick = useSharedValue(0);

  useEffect(() => {
    flick.value = withRepeat(withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.quad) }), -1, true);
  }, [flick]);

  // Two stacked circles fake a soft radial falloff cross-platform: a faint wide
  // halo and a slightly brighter core, both breathing together.
  const halo = useAnimatedStyle(() => ({
    opacity: interpolate(flick.value, [0, 1], [0.14, 0.26]),
    transform: [{ scale: interpolate(flick.value, [0, 1], [1.0, 1.14]) }],
  }));
  const core = useAnimatedStyle(() => ({
    opacity: interpolate(flick.value, [0, 1], [0.18, 0.34]),
    transform: [{ scale: interpolate(flick.value, [0, 1], [0.66, 0.76]) }],
  }));

  const base = { position: 'absolute' as const, left: left as any, top: top as any, backgroundColor: color };

  return (
    <>
      <Animated.View
        pointerEvents="none"
        style={[
          base,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            shadowColor: color,
            shadowOpacity: 0.8,
            shadowRadius: 50,
            shadowOffset: { width: 0, height: 0 },
          },
          halo,
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[base, { width: size, height: size, borderRadius: size / 2 }, core]}
      />
    </>
  );
}
