/**
 * The map of Arda — the home page and the whole navigation. A wood-burned chart
 * of Middle-earth: the Shire in the northwest, Rivendell in the mountain valley,
 * Minas Tirith in the centre and Mordor's volcano to the southeast. Each place
 * bears a marker you tap to journey there; the marker coords are fractions of the
 * map image, tuned to where each place sits on it.
 */
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { TOTAL_WORKS } from '@/data/works';
import { useReading } from '@/state/reading';
import { AppFonts } from '@/theme/fonts';
import { getRegion, RegionKey } from '@/theme/regions';

const MIDDLE_EARTH = require('../../assets/middle-earth.jpg');

interface MarkerDef {
  region: RegionKey;
  route: string;
  /** Fractional position on the chart (0..1). */
  x: number;
  y: number;
}

const MARKERS: MarkerDef[] = [
  { region: 'shire', route: '/shire', x: 0.12, y: 0.25 },
  { region: 'rivendell', route: '/rivendell', x: 0.42, y: 0.28 },
  { region: 'minas-tirith', route: '/minas-tirith', x: 0.44, y: 0.57 },
  { region: 'mordor', route: '/mordor', x: 0.8, y: 0.69 },
];

export default function MapScreen() {
  const router = useRouter();
  const { readCount } = useReading();
  const { width, height } = useWindowDimensions();

  // Tapping a place "dives" the chart toward it — zoom in on the marker and fade,
  // then travel there. Reset on return so the map is whole again.
  const dive = useSharedValue(0);
  const tx = useSharedValue(0.5);
  const ty = useSharedValue(0.5);

  // On arrival (and return from a place) fly out: start zoomed into the last
  // marker, then pull back to the whole chart.
  useFocusEffect(
    useCallback(() => {
      dive.value = 1;
      dive.value = withTiming(0, { duration: 560, easing: Easing.out(Easing.cubic) });
    }, [dive]),
  );

  const go = useCallback((route: string) => router.navigate(route as never), [router]);
  const enterPlace = (m: MarkerDef) => {
    tx.value = m.x;
    ty.value = m.y;
    // Accelerate the whole way in — a flight that gathers speed toward the place.
    dive.value = withTiming(1, { duration: 520, easing: Easing.in(Easing.cubic) }, (done) => {
      if (done) runOnJS(go)(m.route);
    });
  };

  // The chart pitches forward and rushes toward the *tapped marker* (translation
  // is scaled by the zoom so the marker actually reaches centre), blowing past
  // into a dark whoosh — a first-person "fly in" rather than a flat zoom.
  const DIVE_SCALE = 4.2;
  const worldStyle = useAnimatedStyle(() => ({
    opacity: interpolate(dive.value, [0, 0.75, 1], [1, 1, 0]),
    transform: [
      { perspective: 900 },
      { translateX: interpolate(dive.value, [0, 1], [0, (0.5 - tx.value) * width * DIVE_SCALE]) },
      { translateY: interpolate(dive.value, [0, 1], [0, (0.5 - ty.value) * height * DIVE_SCALE]) },
      { rotateX: `${interpolate(dive.value, [0, 1], [0, 14])}deg` },
      { scale: interpolate(dive.value, [0, 1], [1, DIVE_SCALE]) },
    ],
  }));
  const flashStyle = useAnimatedStyle(() => ({ opacity: interpolate(dive.value, [0, 0.65, 1], [0, 0, 0.72]) }));

  return (
    <View style={styles.root}>
      <StatusBar style="dark" animated />

      <Animated.View style={[StyleSheet.absoluteFill, worldStyle]}>
        <Image source={MIDDLE_EARTH} style={StyleSheet.absoluteFill} contentFit="cover" />
        {MARKERS.map((m) => (
          <MapMarker key={m.region} def={m} onEnter={() => enterPlace(m)} />
        ))}
      </Animated.View>

      <View pointerEvents="none" style={styles.burntEdge} />

      <LinearGradient
        colors={['rgba(244,235,212,0.92)', 'rgba(244,235,212,0.5)', 'rgba(244,235,212,0)']}
        locations={[0, 0.6, 1]}
        pointerEvents="none"
        style={styles.headerScrim}
      />

      <SafeAreaView edges={['top']} pointerEvents="box-none">
        <View style={styles.header} pointerEvents="box-none">
          <Text style={styles.greeting}>Mae govannen</Text>
          <Text style={styles.subtitle}>Choose where in Arda to wander</Text>
          <View style={styles.seal}>
            <MaterialCommunityIcons name="book-open-page-variant" size={13} color="#5a3320" />
            <Text style={styles.sealText}>
              {readCount} of {TOTAL_WORKS} works read
            </Text>
          </View>
        </View>
      </SafeAreaView>

      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.diveFlash, flashStyle]} />
    </View>
  );
}

/** A place is marked only by a soft breathing glow and a slow ring pulsing out —
 *  a quiet "you can go here" that stays out of the map's way. Press a glow and the
 *  place's name fades in above it; a quick tap still flies you in, but linger
 *  (a held press) and you only peek the name without travelling. */
function MapMarker({ def, onEnter }: { def: MarkerDef; onEnter: () => void }) {
  const t = getRegion(def.region);
  const pulse = useSharedValue(0);
  const breathe = useSharedValue(0);
  const reveal = useSharedValue(0);
  // A long press means "I'm just reading the name" — don't travel on release.
  const held = useRef(false);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 3000, easing: Easing.out(Easing.quad) }), -1, false);
    breathe.value = withRepeat(withTiming(1, { duration: 1900, easing: Easing.inOut(Easing.quad) }), -1, true);
  }, [pulse, breathe]);

  const ring = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 1], [0.4, 0]),
    transform: [{ scale: interpolate(pulse.value, [0, 1], [0.5, 2.6]) }],
  }));
  const core = useAnimatedStyle(() => ({
    opacity: interpolate(breathe.value, [0, 1], [0.4, 0.8]),
    transform: [{ scale: interpolate(breathe.value, [0, 1], [0.85, 1.12]) }],
  }));
  const label = useAnimatedStyle(() => ({
    opacity: reveal.value,
    transform: [
      { translateY: interpolate(reveal.value, [0, 1], [7, 0]) },
      { scale: interpolate(reveal.value, [0, 1], [0.9, 1]) },
    ],
  }));

  return (
    <Pressable
      onPressIn={() => {
        held.current = false;
        reveal.value = withTiming(1, { duration: 220, easing: Easing.out(Easing.cubic) });
      }}
      onLongPress={() => {
        held.current = true;
      }}
      delayLongPress={300}
      onPress={() => {
        if (!held.current) onEnter();
      }}
      onPressOut={() => {
        reveal.value = withTiming(0, { duration: 200, easing: Easing.in(Easing.quad) });
      }}
      hitSlop={20}
      style={[styles.marker, { left: `${def.x * 100}%`, top: `${def.y * 100}%` }]}
      accessibilityRole="button"
      accessibilityLabel={t.name}>
      <Animated.View style={styles.markerLabelWrap}>
        <Animated.View style={[styles.markerLabel, { borderColor: t.glow, shadowColor: t.glow }, label]}>
          <Text style={styles.markerLabelText}>{t.name}</Text>
        </Animated.View>
      </Animated.View>
      <Animated.View style={[styles.markerRing, { borderColor: t.glow }, ring]} />
      <Animated.View style={[styles.markerCore, { backgroundColor: t.glow, shadowColor: t.glow }, core]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#c9aa7c', overflow: 'hidden' },
  burntEdge: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 26,
    borderColor: 'rgba(58,38,20,0.34)',
    borderRadius: 30,
  },
  headerScrim: { position: 'absolute', top: 0, left: 0, right: 0, height: '24%' },
  diveFlash: { backgroundColor: '#0a0e24' },

  header: { alignItems: 'center', gap: 3, paddingTop: 10, paddingHorizontal: 24 },
  greeting: { fontFamily: AppFonts.displayItalic, fontSize: 34, color: '#3f2d18', letterSpacing: 0.5 },
  subtitle: { fontFamily: AppFonts.bodyItalic, fontSize: 15, color: '#6b563a' },
  seal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(247,240,222,0.72)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(90,51,32,0.4)',
  },
  sealText: { fontFamily: AppFonts.bodyMedium, fontSize: 13, color: '#5a3320', letterSpacing: 0.3 },

  marker: {
    position: 'absolute',
    width: 40,
    height: 40,
    marginLeft: -20,
    marginTop: -20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerLabelWrap: {
    position: 'absolute',
    bottom: 27,
    left: -100,
    right: -100,
    alignItems: 'center',
    pointerEvents: 'none',
  },
  markerLabel: {
    paddingHorizontal: 13,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: 'rgba(247,240,222,0.94)',
    borderWidth: StyleSheet.hairlineWidth,
    shadowOpacity: 0.45,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  markerLabelText: { fontFamily: AppFonts.display, fontSize: 17, color: '#3f2d18', letterSpacing: 0.4 },
  markerRing: { position: 'absolute', width: 24, height: 24, borderRadius: 12, borderWidth: 2 },
  markerCore: {
    width: 10,
    height: 10,
    borderRadius: 5,
    shadowOpacity: 0.95,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
});
