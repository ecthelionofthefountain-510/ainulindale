/**
 * The Compendium — Rivendell's lore, revealed when you tap the great bookshelves.
 * Slides up over the hall as a moonlit sheet of "did you know" cards. Mirrors the
 * Shire's Bookshelf panel so the two regions feel like one app.
 */
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { LORE } from '@/data/lore';
import { AppFonts } from '@/theme/fonts';
import { getRegion } from '@/theme/regions';

const t = getRegion('rivendell');
const PANEL_RATIO = 0.82;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function LorePanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { height } = useWindowDimensions();
  const panelH = height * PANEL_RATIO;
  const progress = useSharedValue(1);

  useEffect(() => {
    progress.value = withTiming(open ? 0 : 1, { duration: 380, easing: Easing.out(Easing.cubic) });
  }, [open, progress]);

  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: progress.value * (panelH + 80) }] }));
  const backdropStyle = useAnimatedStyle(() => ({ opacity: (1 - progress.value) * 0.5 }));

  return (
    <View style={[StyleSheet.absoluteFill, { pointerEvents: open ? 'auto' : 'none' }]}>
      <AnimatedPressable
        style={[styles.backdrop, backdropStyle]}
        onPress={onClose}
        accessibilityLabel="Close the compendium"
      />
      <Animated.View style={[styles.sheet, { height: panelH }, sheetStyle]}>
        <View style={styles.grip} />
        <View style={styles.head}>
          <View style={styles.headText}>
            <Text style={styles.title}>The Compendium</Text>
            <Text style={styles.tagline}>Lore of Arda · {LORE.length} entries</Text>
          </View>
          <Pressable onPress={onClose} style={styles.close} accessibilityRole="button" accessibilityLabel="Close">
            <MaterialCommunityIcons name="close" size={20} color={t.accent} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {LORE.map((entry) => (
            <View key={entry.id} style={styles.card}>
              <View style={styles.cardHead}>
                <MaterialCommunityIcons name="book-open-variant" size={16} color={t.accent} />
                <Text style={styles.cardKicker}>Did you know</Text>
              </View>
              <Text style={styles.cardTitle}>{entry.title}</Text>
              <Text style={styles.cardBody}>{entry.body}</Text>
            </View>
          ))}
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
    backgroundColor: '#12282d',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 18,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: t.border,
  },
  grip: { width: 40, height: 4, borderRadius: 3, backgroundColor: t.border, alignSelf: 'center', marginBottom: 10 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
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
  scroll: { paddingTop: 8, paddingBottom: 40, gap: 12 },
  card: {
    backgroundColor: t.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: t.border,
  },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  cardKicker: {
    fontFamily: AppFonts.bodyMedium,
    fontSize: 11,
    color: t.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  cardTitle: { fontFamily: AppFonts.displayMedium, fontSize: 20, color: t.text, marginBottom: 6 },
  cardBody: { fontFamily: AppFonts.body, fontSize: 15, color: t.text, lineHeight: 23, opacity: 0.92 },
});
