/**
 * SceneView — the heart of the "living wallpaper" navigation. A region is a
 * place you stand inside: a full-bleed image (or placeholder art) with animated
 * light layers on top (a breathing hearth, drifting motes) and invisible
 * hotspots over objects that act as the buttons. No tab bar — you came here from
 * the map, and "the map" chip takes you back. The image is held at a slight zoom
 * so real art has bleed at the edges; the "living" feel comes from the ambient
 * light overlays, not from tilting the phone.
 */
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ReactNode, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { AppFonts } from '@/theme/fonts';
import { getRegion, RegionKey } from '@/theme/regions';

/** How much the world image is zoomed, leaving bleed room at the edges for real art. */
const WORLD_SCALE = 1.08;

/** A tappable region over an object in the scene. Coords are fractions of the screen. */
export interface Hotspot {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  onPress: () => void;
}

export function SceneView({
  region,
  image,
  placeholder,
  hotspots,
  title,
  subtitle,
  overlays,
  zoomed = false,
  children,
}: {
  region: RegionKey;
  image?: number;
  /** Stand-in art shown until `image` lands. Defaults to a Bag End style block-out. */
  placeholder?: ReactNode;
  hotspots: Hotspot[];
  title: string;
  subtitle?: string;
  overlays?: ReactNode;
  /** When a panel is open, push the world in a little — "closing in" on the object. */
  zoomed?: boolean;
  children?: ReactNode;
}) {
  const t = getRegion(region);
  const router = useRouter();

  // Arriving in a place feels like rushing in: the world lands from an over-zoom
  // and the chrome settles a beat later, so you "travel into" the scene.
  const enter = useSharedValue(0);
  useEffect(() => {
    enter.value = withTiming(1, { duration: 620, easing: Easing.out(Easing.cubic) });
  }, [enter]);

  // Opening a panel leans the world in toward the object; closing eases it back.
  const push = useSharedValue(0);
  useEffect(() => {
    push.value = withTiming(zoomed ? 1 : 0, { duration: 460, easing: Easing.out(Easing.cubic) });
  }, [zoomed, push]);

  // Scale-only rush-in (the navigator already cross-fades between screens, so we
  // never gate the world on opacity — it stays visible even mid-animation).
  const worldStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(enter.value, [0, 1], [1.28, WORLD_SCALE]) * (1 + push.value * 0.16) },
    ],
  }));
  const chromeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(enter.value, [0, 0.6, 1], [0, 0.4, 1]),
    transform: [{ translateY: interpolate(enter.value, [0, 1], [-8, 0]) }],
  }));

  return (
    <View style={styles.root}>
      <StatusBar style="light" animated />

      <Animated.View style={[StyleSheet.absoluteFill, worldStyle]}>
        {image ? (
          <Image source={image} style={StyleSheet.absoluteFill} contentFit="cover" />
        ) : (
          placeholder ?? <PlaceholderArt region={region} />
        )}
        {hotspots.map((h) => (
          <HotspotButton key={h.id} spec={h} accent={t.glow} />
        ))}
      </Animated.View>

      {overlays}

      <View pointerEvents="none" style={styles.vignette} />

      <SafeAreaView style={styles.chrome} edges={['top']} pointerEvents="box-none">
        <Animated.View style={[styles.topRow, chromeStyle]} pointerEvents="box-none">
          <View style={styles.titleWrap}>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
          <Pressable
            onPress={() => router.back()}
            style={styles.mapBtn}
            accessibilityRole="button"
            accessibilityLabel="Back to the map of Arda">
            <MaterialCommunityIcons name="map-outline" size={15} color="#e9dcbc" />
            <Text style={styles.mapText}>the map</Text>
          </Pressable>
        </Animated.View>
      </SafeAreaView>

      {children}
    </View>
  );
}

/** A full-bleed layer for the scene's ambient light/atmosphere (hearth glow, motes). */
export function SceneOverlay({ children }: { children: ReactNode }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {children}
    </View>
  );
}

function HotspotButton({ spec, accent }: { spec: Hotspot; accent: string }) {
  const pressed = useSharedValue(0);
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 2400, easing: Easing.out(Easing.quad) }), -1, false);
  }, [pulse]);

  const ring = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 1], [0.5, 0]),
    transform: [{ scale: interpolate(pulse.value, [0, 1], [0.7, 2.1]) }],
  }));
  const fill = useAnimatedStyle(() => ({
    backgroundColor: `rgba(255,235,180,${pressed.value * 0.14})`,
    borderColor: `rgba(255,235,180,${pressed.value * 0.6})`,
  }));

  return (
    <Pressable
      onPressIn={() => {
        pressed.value = withTiming(1, { duration: 120 });
      }}
      onPressOut={() => {
        pressed.value = withTiming(0, { duration: 260 });
      }}
      onPress={spec.onPress}
      accessibilityRole="button"
      accessibilityLabel={spec.label}
      style={[
        styles.hotspot,
        { left: `${spec.x * 100}%`, top: `${spec.y * 100}%`, width: `${spec.w * 100}%`, height: `${spec.h * 100}%` },
      ]}>
      <Animated.View style={[styles.hotspotFill, fill]} />
      <View style={styles.hotspotCenter} pointerEvents="none">
        <Animated.View style={[styles.hotspotRing, { borderColor: accent }, ring]} />
        <View style={[styles.hotspotDot, { backgroundColor: accent }]} />
      </View>
    </Pressable>
  );
}

/**
 * Stand-in art until the photoreal image lands. Blocks out where the room's
 * objects sit so the hotspots line up — swap for an <Image> and delete this.
 */
function PlaceholderArt({ region }: { region: RegionKey }) {
  const t = getRegion(region);
  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient colors={['#2b1c12', '#1a110a', '#100a05']} style={StyleSheet.absoluteFill} />
      <View style={styles.phBeam} />
      <View style={styles.phWindow}>
        <LinearGradient colors={['#d3e6ef', '#9fc06e', '#4f7a2f']} style={StyleSheet.absoluteFill} />
        <View style={styles.phMullionV} />
        <View style={styles.phMullionH} />
      </View>
      <View style={styles.phShelf} />
      <View style={styles.phHearth} />
      <View style={styles.phChair} />
      <View style={styles.phLabel} pointerEvents="none">
        <Text style={[styles.phLabelText, { color: t.glow }]}>Bag End · photoreal art drops in here</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0b0705', overflow: 'hidden' },
  vignette: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 44,
    borderColor: 'rgba(0,0,0,0.3)',
    borderRadius: 40,
  },
  chrome: { ...StyleSheet.absoluteFillObject },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  titleWrap: { flex: 1 },
  title: {
    fontFamily: AppFonts.displayItalic,
    fontSize: 30,
    color: '#f2e6c8',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowRadius: 8,
    textShadowOffset: { width: 0, height: 2 },
  },
  subtitle: {
    fontFamily: AppFonts.bodyItalic,
    fontSize: 13,
    color: '#c9b892',
    marginTop: -2,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowRadius: 6,
  },
  mapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(20,12,7,0.5)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(233,220,188,0.28)',
  },
  mapText: { fontFamily: AppFonts.bodyMedium, fontSize: 12, color: '#e9dcbc', letterSpacing: 0.3 },

  hotspot: { position: 'absolute', alignItems: 'center', justifyContent: 'center', borderRadius: 16 },
  hotspotFill: { ...StyleSheet.absoluteFillObject, borderRadius: 16, borderWidth: 1.5 },
  hotspotCenter: { alignItems: 'center', justifyContent: 'center' },
  hotspotRing: { position: 'absolute', width: 22, height: 22, borderRadius: 11, borderWidth: 1.5 },
  hotspotDot: { width: 7, height: 7, borderRadius: 4, opacity: 0.85 },

  phBeam: { position: 'absolute', left: 0, right: 0, top: '6%', height: 16, backgroundColor: '#3a2410' },
  phWindow: {
    position: 'absolute',
    left: '56%',
    top: '10%',
    width: '40%',
    height: '26%',
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 6,
    borderColor: '#4a4038',
  },
  phMullionV: { position: 'absolute', left: '50%', top: '8%', bottom: '8%', width: 3, marginLeft: -1.5, backgroundColor: '#4a4038' },
  phMullionH: { position: 'absolute', top: '50%', left: '8%', right: '8%', height: 3, marginTop: -1.5, backgroundColor: '#4a4038' },
  phShelf: {
    position: 'absolute',
    left: '4%',
    top: '12%',
    width: '34%',
    height: '46%',
    backgroundColor: '#241610',
    borderRadius: 4,
    borderWidth: 3,
    borderColor: '#3a2410',
  },
  phHearth: {
    position: 'absolute',
    left: '6%',
    top: '58%',
    width: '40%',
    height: '30%',
    backgroundColor: '#1a0f08',
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    borderWidth: 3,
    borderColor: '#3a2c22',
  },
  phChair: {
    position: 'absolute',
    left: '32%',
    top: '60%',
    width: '44%',
    height: '34%',
    backgroundColor: '#232b33',
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
  },
  phLabel: { position: 'absolute', left: 0, right: 0, bottom: '4%', alignItems: 'center' },
  phLabelText: { fontFamily: AppFonts.bodyItalic, fontSize: 12, opacity: 0.7 },
});
