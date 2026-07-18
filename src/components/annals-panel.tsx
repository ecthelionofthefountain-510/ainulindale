/**
 * The record kept behind Rivendell's great stained window — which Elrond has
 * watched the Ages through, and whose own blood runs in its lineages. Slides up
 * like the Compendium and holds two leaves you switch between:
 *   · The Ages — a glowing vertical timeline of the Ages of the World.
 *   · The Houses — the descent of the Half-elven, read top to bottom.
 */
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { ANNALS } from '@/data/annals';
import { LINEAGES } from '@/data/lineages';
import { AppFonts } from '@/theme/fonts';
import { getRegion } from '@/theme/regions';

const t = getRegion('rivendell');
const PANEL_RATIO = 0.86;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const EVENT_COUNT = ANNALS.reduce((n, era) => n + era.events.length, 0);

type Leaf = 'ages' | 'houses';

export function AnnalsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { height } = useWindowDimensions();
  const panelH = height * PANEL_RATIO;
  const progress = useSharedValue(1);
  const [leaf, setLeaf] = useState<Leaf>('ages');

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
            <Text style={styles.tagline}>
              {leaf === 'ages'
                ? `The Ages of the World · ${EVENT_COUNT} entries`
                : 'The Houses · Elrond’s own line'}
            </Text>
          </View>
          <Pressable onPress={onClose} style={styles.close} accessibilityRole="button" accessibilityLabel="Close">
            <MaterialCommunityIcons name="close" size={20} color={t.accent} />
          </Pressable>
        </View>

        <View style={styles.tabs}>
          <Tab label="The Ages" active={leaf === 'ages'} onPress={() => setLeaf('ages')} />
          <Tab label="The Houses" active={leaf === 'houses'} onPress={() => setLeaf('houses')} />
        </View>

        {leaf === 'ages' ? <AgesLeaf /> : <HousesLeaf />}
      </Animated.View>
    </View>
  );
}

function Tab({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tab, active && styles.tabActive]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}>
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
    </Pressable>
  );
}

/** The Ages — a glowing vertical timeline, threaded era by era. */
function AgesLeaf() {
  return (
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
  );
}

/** The Houses — pick one house and read its line of descent, ancestors down. */
function HousesLeaf() {
  const [houseId, setHouseId] = useState<string>(LINEAGES[0].id);
  const house = LINEAGES.find((l) => l.id === houseId) ?? LINEAGES[0];

  return (
    <View style={styles.housesWrap}>
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

      <ScrollView style={styles.housesList} contentContainerStyle={styles.housesScroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.housesLede}>{house.title}</Text>
        <Text style={styles.housesSub}>{house.subtitle}</Text>

        {house.nodes.map((node, i) => (
        <View key={i} style={styles.houseGroup}>
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
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
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

  tabs: {
    flexDirection: 'row',
    gap: 6,
    padding: 4,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.22)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: t.border,
    marginBottom: 4,
  },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
  tabActive: { backgroundColor: t.surfaceAlt },
  tabText: { fontFamily: AppFonts.bodyMedium, fontSize: 13.5, color: t.textMuted, letterSpacing: 0.4 },
  tabTextActive: { color: t.accent },

  scroll: { paddingTop: 12, paddingBottom: 48 },

  row: { flexDirection: 'row' },
  rail: { width: RAIL_W },
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
  yearText: { fontFamily: AppFonts.bodyMedium, fontSize: 11, color: t.accent, letterSpacing: 0.6 },
  eventTitle: { fontFamily: AppFonts.displayMedium, fontSize: 19, color: t.text, marginBottom: 3 },
  eventBody: { fontFamily: AppFonts.body, fontSize: 14.5, color: t.text, lineHeight: 22, opacity: 0.9 },

  // The Houses
  housesWrap: { flex: 1 },
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

  housesList: { flex: 1 },
  housesScroll: { paddingTop: 12, paddingBottom: 52, alignItems: 'center' },
  housesLede: { fontFamily: AppFonts.display, fontSize: 24, color: t.accent, textAlign: 'center' },
  housesSub: {
    fontFamily: AppFonts.bodyItalic,
    fontSize: 13,
    color: t.textMuted,
    textAlign: 'center',
    marginTop: 1,
    marginBottom: 4,
  },
  houseGroup: { alignItems: 'center', alignSelf: 'stretch' },

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
