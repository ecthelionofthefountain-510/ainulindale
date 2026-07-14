/**
 * A breath of wind seen through a window. Over a still photo we can't move the
 * grass itself, so we drift a couple of very soft light/shadow patches across the
 * view — like cloud shadows and shifting sun over the hills. Clip it to the
 * window's shape (a round frame for Bag End) and keep it subtle.
 */
import { useEffect } from 'react';
import { DimensionValue, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface PatchSpec {
  color: string;
  duration: number;
  delay: number;
  from: { x: number; y: number };
  to: { x: number; y: number };
  size: `${number}%`;
  top: `${number}%`;
  left: `${number}%`;
}

function Patch({ spec }: { spec: PatchSpec }) {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withDelay(
      spec.delay,
      withRepeat(withTiming(1, { duration: spec.duration, easing: Easing.inOut(Easing.ease) }), -1, true),
    );
  }, [p, spec.delay, spec.duration]);

  const style = useAnimatedStyle(() => ({
    opacity: interpolate(p.value, [0, 0.5, 1], [0.25, 1, 0.25]),
    transform: [
      { translateX: interpolate(p.value, [0, 1], [spec.from.x, spec.to.x]) },
      { translateY: interpolate(p.value, [0, 1], [spec.from.y, spec.to.y]) },
    ],
  }));

  return (
    <Animated.View
      style={[
        { position: 'absolute', left: spec.left, top: spec.top, width: spec.size, height: spec.size, borderRadius: 999, backgroundColor: spec.color },
        style,
      ]}
    />
  );
}

/** Position over the window; `round` clips to a circular frame (Bag End's window). */
export function WindowBreeze({
  left,
  top,
  width,
  round = true,
}: {
  left: DimensionValue;
  top: DimensionValue;
  width: DimensionValue;
  round?: boolean;
}) {
  const patches: PatchSpec[] = [
    // A cloud shadow drifting across the fields.
    { color: 'rgba(24,44,18,0.12)', duration: 9000, delay: 0, from: { x: -22, y: 4 }, to: { x: 24, y: -6 }, size: '85%', left: '8%', top: '30%' },
    // A slow shift of warm sunlight.
    { color: 'rgba(255,250,215,0.08)', duration: 11000, delay: 2400, from: { x: 18, y: -4 }, to: { x: -16, y: 8 }, size: '70%', left: '18%', top: '18%' },
  ];

  return (
    <View
      pointerEvents="none"
      style={{ position: 'absolute', left, top, width, aspectRatio: 1, borderRadius: round ? 9999 : 12, overflow: 'hidden' }}>
      {patches.map((s, i) => (
        <Patch key={i} spec={s} />
      ))}
    </View>
  );
}
