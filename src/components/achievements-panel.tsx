/**
 * Deeds of Renown — Minas Tirith's achievements, revealed when you enter the
 * halls of the kings. Each deed is earned as your reading grows. Slides up like
 * the other regions' sheets so Gondor belongs to the same app.
 */
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { TOTAL_WORKS } from '@/data/works';
import { useReading } from '@/state/reading';
import { AppFonts } from '@/theme/fonts';
import { getRegion } from '@/theme/regions';

const t = getRegion('minas-tirith');
const PANEL_RATIO = 0.82;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Achievement {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  detail: string;
  unlocked: (readCount: number) => boolean;
}

const ACHIEVEMENTS: Achievement[] = [
  { icon: 'ring', title: 'There and Back Again', detail: 'Read your first work', unlocked: (n) => n >= 1 },
  { icon: 'bookshelf', title: 'A Well-Stocked Hobbit-hole', detail: 'Read five works', unlocked: (n) => n >= 5 },
  { icon: 'tree', title: 'The White Tree Blooms', detail: 'Read half the legendarium', unlocked: (n) => n >= Math.ceil(TOTAL_WORKS / 2) },
  { icon: 'crown', title: 'Master of the Lore', detail: 'Read every work', unlocked: (n) => n >= TOTAL_WORKS },
];

export function AchievementsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { readCount } = useReading();
  const { height } = useWindowDimensions();
  const panelH = height * PANEL_RATIO;
  const progress = useSharedValue(1);

  useEffect(() => {
    progress.value = withTiming(open ? 0 : 1, { duration: 380, easing: Easing.out(Easing.cubic) });
  }, [open, progress]);

  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: progress.value * (panelH + 80) }] }));
  const backdropStyle = useAnimatedStyle(() => ({ opacity: (1 - progress.value) * 0.5 }));

  const earned = ACHIEVEMENTS.filter((a) => a.unlocked(readCount)).length;

  return (
    <View style={[StyleSheet.absoluteFill, { pointerEvents: open ? 'auto' : 'none' }]}>
      <AnimatedPressable style={[styles.backdrop, backdropStyle]} onPress={onClose} accessibilityLabel="Leave the hall" />
      <Animated.View style={[styles.sheet, { height: panelH }, sheetStyle]}>
        <View style={styles.grip} />
        <View style={styles.head}>
          <View style={styles.headText}>
            <Text style={styles.title}>Deeds of Renown</Text>
            <Text style={styles.tagline}>
              {earned} of {ACHIEVEMENTS.length} earned
            </Text>
          </View>
          <Pressable onPress={onClose} style={styles.close} accessibilityRole="button" accessibilityLabel="Close">
            <MaterialCommunityIcons name="close" size={20} color={t.accent} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {ACHIEVEMENTS.map((a) => {
            const done = a.unlocked(readCount);
            return (
              <View key={a.title} style={[styles.card, done && { borderColor: t.accent }]}>
                <View style={[styles.iconWrap, { backgroundColor: done ? `${t.accent}22` : t.surfaceAlt }]}>
                  <MaterialCommunityIcons
                    name={done ? a.icon : 'lock-outline'}
                    size={24}
                    color={done ? t.accent : t.textMuted}
                  />
                </View>
                <View style={styles.cardBody}>
                  <Text style={[styles.cardTitle, { color: done ? t.text : t.textMuted }]}>{a.title}</Text>
                  <Text style={styles.cardDetail}>{a.detail}</Text>
                </View>
                {done ? <MaterialCommunityIcons name="check-decagram" size={20} color={t.accent} /> : null}
              </View>
            );
          })}
          <Text style={styles.footnote}>More honours are graven here as the app grows — stats, streaks and titles.</Text>
        </ScrollView>
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
  scroll: { paddingTop: 6, paddingBottom: 40, gap: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: t.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: t.border,
  },
  iconWrap: { width: 46, height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardBody: { flex: 1 },
  cardTitle: { fontFamily: AppFonts.displayMedium, fontSize: 19 },
  cardDetail: { fontFamily: AppFonts.body, fontSize: 14, color: t.textMuted, marginTop: 1 },
  footnote: {
    fontFamily: AppFonts.bodyItalic,
    fontSize: 14,
    color: t.textMuted,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
});
