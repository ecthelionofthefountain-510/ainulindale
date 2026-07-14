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
import { useCallback, useEffect } from 'react';
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

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

interface MarkerDef {
  region: RegionKey;
  route: string;
  icon: IconName;
  /** Fractional position on the chart (0..1). */
  x: number;
  y: number;
}

const MARKERS: MarkerDef[] = [
  { region: 'shire', route: '/shire', icon: 'sprout', x: 0.12, y: 0.25 },
  { region: 'rivendell', route: '/rivendell', icon: 'waves', x: 0.42, y: 0.28 },
  { region: 'minas-tirith', route: '/minas-tirith', icon: 'castle', x: 0.44, y: 0.57 },
  { region: 'mordor', route: '/mordor', icon: 'triangle', x: 0.8, y: 0.69 },
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
          <MapMarker key={m.region} def={m} onPress={() => enterPlace(m)} />
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

function MapMarker({ def, onPress }: { def: MarkerDef; onPress: () => void }) {
  const t = getRegion(def.region);
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 2600, easing: Easing.out(Easing.quad) }), -1, false);
  }, [pulse]);

  const halo = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 1], [0.5, 0]),
    transform: [{ scale: interpolate(pulse.value, [0, 1], [0.8, 2.2]) }],
  }));

  return (
    <Pressable
      onPress={onPress}
      style={[styles.marker, { left: `${def.x * 100}%`, top: `${def.y * 100}%` }]}
      accessibilityRole="button"
      accessibilityLabel={t.name}>
      <View style={styles.markerDotWrap}>
        <Animated.View style={[styles.halo, { backgroundColor: t.glow }, halo]} />
        <View style={[styles.dot, { backgroundColor: t.glow, borderColor: '#fbf3dc' }]}>
          <MaterialCommunityIcons name={def.icon} size={13} color="#fbf3dc" />
        </View>
      </View>
      <View style={styles.label}>
        <Text style={styles.labelText}>{t.name}</Text>
      </View>
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

  marker: { position: 'absolute', alignItems: 'center' },
  markerDotWrap: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  halo: { position: 'absolute', width: 30, height: 30, borderRadius: 15 },
  dot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    elevation: 4,
  },
  label: {
    marginTop: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: 'rgba(251,243,220,0.82)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(90,51,32,0.35)',
  },
  labelText: { fontFamily: AppFonts.displayMedium, fontSize: 14, color: '#3f2d18', letterSpacing: 0.5 },
});
