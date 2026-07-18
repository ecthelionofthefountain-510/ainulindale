/**
 * The Annals of Arda — Rivendell's timeline, revealed when you tap the great
 * stained window (which Elrond has watched the Ages through). Slides up like the
 * Compendium, but instead of cards it draws a glowing vertical rail: era markers
 * and event nodes threaded down through the Ages of the World.
 */
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { ANNALS } from '@/data/annals';
import { AppFonts } from '@/theme/fonts';
import { getRegion } from '@/theme/regions';

const t = getRegion('rivendell');
const PANEL_RATIO = 0.86;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const EVENT_COUNT = ANNALS.reduce((n, era) => n + era.events.length, 0);

export function AnnalsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
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
        accessibilityLabel="Close the annals"
      />
      <Animated.View style={[styles.sheet, { height: panelH }, sheetStyle]}>
        <View style={styles.grip} />
        <View style={styles.head}>
          <View style={styles.headText}>
            <Text style={styles.title}>Annals of Arda</Text>
            <Text style={styles.tagline}>The Ages of the World · {EVENT_COUNT} entries</Text>
          </View>
          <Pressable onPress={onClose} style={styles.close} accessibilityRole="button" accessibilityLabel="Close">
            <MaterialCommunityIcons name="close" size={20} color={t.accent} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {ANNALS.map((era, ei) => (
            <View key={era.id}>
              <View style={styles.row}>
                <View style={styles.rail}>
                  {ei > 0 ? <View style={styles.railLineTop} /> : null}
                  <View style={styles.railLineBottom} />
                  <View style={styles.eraNode} />
                </View>
                <View style={styles.eraHead}>
                  <Text style={styles.eraName}>{era.name}</Text>
                  <Text style={styles.eraSpan}>{era.span}</Text>
                  <Text style={styles.eraNote}>{era.note}</Text>
                </View>
              </View>

              {era.events.map((ev, evi) => {
                const last = ei === ANNALS.length - 1 && evi === era.events.length - 1;
                return (
                  <View key={`${era.id}-${evi}`} style={styles.row}>
                    <View style={styles.rail}>
                      <View style={styles.railLineTop} />
                      {last ? null : <View style={styles.railLineBottom} />}
                      <View style={styles.node} />
                    </View>
                    <View style={styles.event}>
                      <View style={styles.yearChip}>
                        <Text style={styles.yearText}>{ev.year}</Text>
                      </View>
                      <Text style={styles.eventTitle}>{ev.title}</Text>
                      <Text style={styles.eventBody}>{ev.body}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const RAIL_W = 34;
const RAIL_CENTER = 16; // where the line/nodes sit within the gutter
const NODE_TOP = 7; // vertical offset so nodes line up with the year/era heading

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

  scroll: { paddingTop: 10, paddingBottom: 48 },

  row: { flexDirection: 'row' },
  rail: { width: RAIL_W },
  // The glowing thread runs the full height of a row; top/bottom halves let the
  // line break cleanly at the very first era and the very last event.
  railLineTop: {
    position: 'absolute',
    left: RAIL_CENTER - 1,
    top: 0,
    height: NODE_TOP,
    width: 2,
    backgroundColor: t.border,
  },
  railLineBottom: {
    position: 'absolute',
    left: RAIL_CENTER - 1,
    top: NODE_TOP,
    bottom: 0,
    width: 2,
    backgroundColor: t.border,
  },
  node: {
    position: 'absolute',
    left: RAIL_CENTER - 5,
    top: NODE_TOP - 4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: t.accent,
    borderWidth: 2,
    borderColor: '#12282d',
    shadowColor: t.glow,
    shadowOpacity: 0.9,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  eraNode: {
    position: 'absolute',
    left: RAIL_CENTER - 7,
    top: NODE_TOP - 6,
    width: 14,
    height: 14,
    borderRadius: 3,
    backgroundColor: t.accentSoft,
    borderWidth: 2,
    borderColor: '#12282d',
    transform: [{ rotate: '45deg' }],
    shadowColor: t.glow,
    shadowOpacity: 0.9,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 0 },
  },

  eraHead: { flex: 1, paddingTop: 0, paddingBottom: 14 },
  eraName: { fontFamily: AppFonts.display, fontSize: 23, color: t.accent, marginTop: -4 },
  eraSpan: {
    fontFamily: AppFonts.bodyMedium,
    fontSize: 11,
    color: t.accentSoft,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 1,
  },
  eraNote: { fontFamily: AppFonts.bodyItalic, fontSize: 13.5, color: t.textMuted, marginTop: 4 },

  event: { flex: 1, paddingBottom: 18 },
  yearChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: t.border,
    backgroundColor: t.surface,
    marginBottom: 5,
  },
  yearText: {
    fontFamily: AppFonts.bodyMedium,
    fontSize: 11,
    color: t.accent,
    letterSpacing: 0.6,
  },
  eventTitle: { fontFamily: AppFonts.displayMedium, fontSize: 19, color: t.text, marginBottom: 3 },
  eventBody: { fontFamily: AppFonts.body, fontSize: 14.5, color: t.text, lineHeight: 22, opacity: 0.9 },
});
