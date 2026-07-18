/**
 * The Houses — the genealogies of Middle-earth, unrolled from the scrolls on
 * Rivendell's reading desk. A slide-up sheet (matching the Compendium and the
 * Annals) with a chip filter across the top: pick one house and read its line of
 * descent, ancestors down. The renderer draws three kinds of node — a 'line' (a
 * person or a union A ⚭ B), a 'fork' (a house splitting in two) and a 'reunion'
 * (a highlighted culminating figure or joining).
 */
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { LINEAGES } from '@/data/lineages';
import { AppFonts } from '@/theme/fonts';
import { getRegion } from '@/theme/regions';

const t = getRegion('rivendell');
const PANEL_RATIO = 0.86;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function LineagePanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { height } = useWindowDimensions();
  const panelH = height * PANEL_RATIO;
  const progress = useSharedValue(1);
  const [houseId, setHouseId] = useState<string>(LINEAGES[0].id);
  const house = LINEAGES.find((l) => l.id === houseId) ?? LINEAGES[0];

  useEffect(() => {
    progress.value = withTiming(open ? 0 : 1, { duration: 380, easing: Easing.out(Easing.cubic) });
  }, [open, progress]);

  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: progress.value * (panelH + 80) }] }));
  const backdropStyle = useAnimatedStyle(() => ({ opacity: (1 - progress.value) * 0.5 }));

  return (
    <View style={[StyleSheet.absoluteFill, { pointerEvents: open ? 'auto' : 'none' }]}>
      <AnimatedPressable style={[styles.backdrop, backdropStyle]} onPress={onClose} accessibilityLabel="Close the houses" />
      <Animated.View style={[styles.sheet, { height: panelH }, sheetStyle]}>
        <View style={styles.grip} />
        <View style={styles.head}>
          <View style={styles.headText}>
            <Text style={styles.title}>The Houses</Text>
            <Text style={styles.tagline}>Lineages of Middle-earth · {LINEAGES.length} houses</Text>
          </View>
          <Pressable onPress={onClose} style={styles.close} accessibilityRole="button" accessibilityLabel="Close">
            <MaterialCommunityIcons name="close" size={20} color={t.accent} />
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
          style={styles.chipScroll}>
          {LINEAGES.map((l) => {
            const active = l.id === house.id;
            return (
              <Pressable
                key={l.id}
                onPress={() => setHouseId(l.id)}
                style={[styles.chip, active && styles.chipActive]}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={l.title}>
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{l.chip}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <ScrollView style={styles.list} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.lede}>{house.title}</Text>
          <Text style={styles.sub}>{house.subtitle}</Text>

          {house.nodes.map((node, i) => (
            <View key={i} style={styles.group}>
              {i > 0 ? <Descent /> : null}

              {node.kind === 'fork' ? (
                <>
                  <PersonCard names={node.heading} note={node.note} tone="fork" />
                  <View style={styles.branches}>
                    <BranchCard person={node.left} />
                    <BranchCard person={node.right} />
                  </View>
                </>
              ) : (
                <PersonCard
                  names={node.names}
                  epithet={node.epithet}
                  note={node.note}
                  tone={node.kind === 'reunion' ? 'reunion' : 'line'}
                />
              )}
            </View>
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

/** A short connector between generations. */
function Descent() {
  return (
    <View style={styles.descent}>
      <View style={styles.descentLine} />
      <View style={styles.descentDot} />
      <View style={styles.descentLine} />
    </View>
  );
}

function PersonCard({
  names,
  epithet,
  note,
  tone,
}: {
  names: string;
  epithet?: string;
  note: string;
  tone: 'line' | 'fork' | 'reunion';
}) {
  return (
    <View style={[styles.person, tone === 'reunion' && styles.personReunion, tone === 'fork' && styles.personFork]}>
      <Text style={[styles.personName, tone === 'reunion' && styles.personNameReunion]}>{names}</Text>
      {epithet ? <Text style={styles.personEpithet}>{epithet}</Text> : null}
      <Text style={styles.personNote}>{note}</Text>
    </View>
  );
}

function BranchCard({ person }: { person: { names: string; epithet?: string; note: string } }) {
  return (
    <View style={styles.branch}>
      <Text style={styles.branchName}>{person.names}</Text>
      {person.epithet ? <Text style={styles.branchEpithet}>{person.epithet}</Text> : null}
      <Text style={styles.branchNote}>{person.note}</Text>
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
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
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

  chipScroll: { flexGrow: 0, marginTop: 6, marginBottom: 2 },
  chipRow: { gap: 7, paddingVertical: 4, paddingRight: 8 },
  chip: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: t.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: t.border,
  },
  chipActive: { backgroundColor: t.surfaceAlt, borderColor: t.accent },
  chipText: { fontFamily: AppFonts.bodyMedium, fontSize: 12.5, color: t.textMuted, letterSpacing: 0.3 },
  chipTextActive: { color: t.accent },

  list: { flex: 1 },
  scroll: { paddingTop: 12, paddingBottom: 52, alignItems: 'center' },
  lede: { fontFamily: AppFonts.display, fontSize: 24, color: t.accent, textAlign: 'center' },
  sub: {
    fontFamily: AppFonts.bodyItalic,
    fontSize: 13,
    color: t.textMuted,
    textAlign: 'center',
    marginTop: 1,
    marginBottom: 4,
  },
  group: { alignItems: 'center', alignSelf: 'stretch' },

  descent: { alignItems: 'center', paddingVertical: 2 },
  descentLine: { width: 2, height: 9, backgroundColor: t.border },
  descentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: t.accentSoft,
    marginVertical: 1,
    shadowColor: t.glow,
    shadowOpacity: 0.8,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },

  person: {
    alignSelf: 'stretch',
    backgroundColor: t.surface,
    borderRadius: 16,
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: t.border,
    alignItems: 'center',
  },
  personFork: { backgroundColor: t.surfaceAlt },
  personReunion: {
    borderColor: t.accent,
    borderWidth: 1,
    backgroundColor: t.surfaceAlt,
    shadowColor: t.glow,
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  personName: { fontFamily: AppFonts.display, fontSize: 21, color: t.text, textAlign: 'center' },
  personNameReunion: { color: t.accent },
  personEpithet: {
    fontFamily: AppFonts.bodyItalic,
    fontSize: 12.5,
    color: t.accentSoft,
    textAlign: 'center',
    marginTop: 1,
  },
  personNote: {
    fontFamily: AppFonts.body,
    fontSize: 14,
    color: t.text,
    opacity: 0.9,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 6,
  },

  branches: { flexDirection: 'row', gap: 10, alignSelf: 'stretch', marginTop: 10 },
  branch: {
    flex: 1,
    backgroundColor: t.surface,
    borderRadius: 14,
    padding: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: t.border,
  },
  branchName: { fontFamily: AppFonts.displayMedium, fontSize: 16.5, color: t.text },
  branchEpithet: { fontFamily: AppFonts.bodyItalic, fontSize: 12, color: t.accentSoft, marginTop: 2 },
  branchNote: { fontFamily: AppFonts.body, fontSize: 13, color: t.text, opacity: 0.88, lineHeight: 19, marginTop: 5 },
});
