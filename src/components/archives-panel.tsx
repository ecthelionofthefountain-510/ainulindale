/**
 * The Archives — kept in the Tower of Ecthelion, revealed when you look up from
 * the Court of the Fountain. Where the Deeds of Renown (the hall) celebrate
 * milestones, the Archives simply tally your reading: how far through the whole
 * legendarium you are, and how each part of it stands. Slides up like the other
 * regions' sheets so Gondor belongs to the same app.
 */
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { CATEGORIES, TOTAL_WORKS, WORKS } from '@/data/works';
import { useReading } from '@/state/reading';
import { AppFonts } from '@/theme/fonts';
import { getRegion } from '@/theme/regions';

const t = getRegion('minas-tirith');
const PANEL_RATIO = 0.82;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ArchivesPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { readCount, readIds } = useReading();
  const { height } = useWindowDimensions();
  const panelH = height * PANEL_RATIO;
  const progress = useSharedValue(1);
  // Bars grow from empty each time the sheet opens.
  const reveal = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(open ? 0 : 1, { duration: 380, easing: Easing.out(Easing.cubic) });
    reveal.value = withTiming(open ? 1 : 0, { duration: open ? 760 : 200, easing: Easing.out(Easing.cubic) });
  }, [open, progress, reveal]);

  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: progress.value * (panelH + 80) }] }));
  const backdropStyle = useAnimatedStyle(() => ({ opacity: (1 - progress.value) * 0.5 }));

  const overall = TOTAL_WORKS > 0 ? readCount / TOTAL_WORKS : 0;
  const perCategory = CATEGORIES.map((c) => {
    const works = WORKS.filter((w) => w.category === c.key);
    const read = works.filter((w) => readIds.has(w.id)).length;
    return { ...c, read, total: works.length };
  });
  const remaining = TOTAL_WORKS - readCount;

  return (
    <View style={[StyleSheet.absoluteFill, { pointerEvents: open ? 'auto' : 'none' }]}>
      <AnimatedPressable style={[styles.backdrop, backdropStyle]} onPress={onClose} accessibilityLabel="Leave the archives" />
      <Animated.View style={[styles.sheet, { height: panelH }, sheetStyle]}>
        <View style={styles.grip} />
        <View style={styles.head}>
          <View style={styles.headText}>
            <Text style={styles.title}>The Archives</Text>
            <Text style={styles.tagline}>Your reading, tallied</Text>
          </View>
          <Pressable onPress={onClose} style={styles.close} accessibilityRole="button" accessibilityLabel="Close">
            <MaterialCommunityIcons name="close" size={20} color={t.accent} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <View style={styles.heroTop}>
              <View style={styles.heroCount}>
                <Text style={styles.heroNum}>{readCount}</Text>
                <Text style={styles.heroOf}>/ {TOTAL_WORKS}</Text>
              </View>
              <Text style={styles.heroPct}>{Math.round(overall * 100)}%</Text>
            </View>
            <Bar fraction={overall} reveal={reveal} tall />
            <Text style={styles.heroSub}>
              {remaining > 0
                ? `${remaining} ${remaining === 1 ? 'work' : 'works'} of the legendarium yet to read`
                : 'Every work read — Master of the Lore'}
            </Text>
          </View>

          {perCategory.map((c) => (
            <View key={c.key} style={styles.row}>
              <View style={styles.rowHead}>
                <Text style={styles.rowLabel}>{c.label}</Text>
                <Text style={styles.rowCount}>
                  {c.read}<Text style={styles.rowTotal}> / {c.total}</Text>
                </Text>
              </View>
              <Bar fraction={c.total > 0 ? c.read / c.total : 0} reveal={reveal} />
            </View>
          ))}

          <Text style={styles.footnote}>Kept by the wardens of the Tower, and set down anew with each work you read.</Text>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

/** A gold progress bar that grows to `fraction` (0..1) as `reveal` rises. */
function Bar({ fraction, reveal, tall }: { fraction: number; reveal: SharedValue<number>; tall?: boolean }) {
  const fill = useAnimatedStyle(() => {
    const f = Math.max(0, Math.min(1, reveal.value * fraction));
    return { width: `${f * 100}%` };
  });
  return (
    <View style={[styles.track, tall && styles.trackTall]}>
      <Animated.View style={[styles.fill, fill]}>
        <LinearGradient
          colors={[t.accentSoft, t.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: '#000' },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#141c30',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 18,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: t.border,
  },
  grip: { width: 40, height: 4, borderRadius: 3, backgroundColor: t.border, alignSelf: 'center', marginBottom: 10 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  headText: { flex: 1 },
  title: { fontFamily: AppFonts.display, fontSize: 28, color: t.accent },
  tagline: { fontFamily: AppFonts.bodyItalic, fontSize: 13, color: t.textMuted, marginTop: -2 },
  close: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: t.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { paddingTop: 6, paddingBottom: 40, gap: 14 },

  hero: {
    backgroundColor: t.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: t.border,
  },
  heroTop: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 12 },
  heroCount: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  heroNum: { fontFamily: AppFonts.display, fontSize: 46, color: t.text, lineHeight: 48 },
  heroOf: { fontFamily: AppFonts.displayMedium, fontSize: 22, color: t.textMuted },
  heroPct: { fontFamily: AppFonts.display, fontSize: 30, color: t.accent },
  heroSub: { fontFamily: AppFonts.bodyItalic, fontSize: 13.5, color: t.textMuted, marginTop: 11 },

  row: {
    backgroundColor: t.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: t.border,
  },
  rowHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 9 },
  rowLabel: { fontFamily: AppFonts.displayMedium, fontSize: 17, color: t.text, flex: 1, marginRight: 10 },
  rowCount: { fontFamily: AppFonts.bodyMedium, fontSize: 15, color: t.accent },
  rowTotal: { fontFamily: AppFonts.body, fontSize: 14, color: t.textMuted },

  track: { height: 8, borderRadius: 5, backgroundColor: 'rgba(0,0,0,0.32)', overflow: 'hidden' },
  trackTall: { height: 12, borderRadius: 6 },
  fill: { height: '100%', borderRadius: 6, overflow: 'hidden', backgroundColor: t.accent },

  footnote: {
    fontFamily: AppFonts.bodyItalic,
    fontSize: 13.5,
    color: t.textMuted,
    marginTop: 4,
    textAlign: 'center',
    lineHeight: 20,
  },
});
