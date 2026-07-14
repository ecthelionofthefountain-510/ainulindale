/**
 * The Bookshelf — the Shire's reading log, revealed when you tap the shelves in
 * Bag End. It rises as an open book: a leather-bound tome you flip through, one
 * spread per part of the legendarium. The left page illuminates the part; the
 * right page lists its works, and tapping a title marks it read. Swipe (or use
 * the corner chevrons) to turn the page. Same data and persistence as before.
 */
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { CATEGORIES, TOTAL_WORKS, Work, WORKS } from '@/data/works';
import { useReading } from '@/state/reading';
import { AppFonts } from '@/theme/fonts';

const PANEL_RATIO = 0.86;
const INK = '#3a2c14';
const INK_SOFT = '#7a6a45';
const RUBRIC = '#8a3324'; // the red of an illuminated capital
const GREEN = '#5f7a2e';
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** One spread = one part of the legendarium; a frontispiece opens the book. */
interface Spread {
  key: string;
  label: string;
  blurb: string;
  items: Work[];
}

function WorkRow({ work }: { work: Work }) {
  const { isRead, toggle } = useReading();
  const read = isRead(work.id);
  return (
    <Pressable
      onPress={() => toggle(work.id)}
      style={styles.row}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: read }}
      accessibilityLabel={work.title}>
      <MaterialCommunityIcons
        name={read ? 'circle-slice-8' : 'circle-outline'}
        size={16}
        color={read ? GREEN : '#b9a877'}
      />
      <Text style={[styles.rowTitle, read && styles.rowTitleRead]} numberOfLines={2}>
        {work.title}
      </Text>
      {work.year ? <Text style={styles.rowYear}>{work.year}</Text> : null}
    </Pressable>
  );
}

/** The soft shadow where the pages meet the spine, curving into the gutter. */
function Gutter({ side }: { side: 'left' | 'right' }) {
  return (
    <LinearGradient
      colors={['rgba(74,48,24,0)', 'rgba(74,48,24,0.36)']}
      start={side === 'left' ? { x: 0, y: 0 } : { x: 1, y: 0 }}
      end={side === 'left' ? { x: 1, y: 0 } : { x: 0, y: 0 }}
      style={[styles.gutter, side === 'left' ? { right: 0 } : { left: 0 }]}
      pointerEvents="none"
    />
  );
}

/** The book's title page: overall progress and a table of contents you can jump to. */
function Frontispiece({ pct, onJump }: { pct: number; onJump: (index: number) => void }) {
  const { readCount, readIds } = useReading();
  return (
    <>
      <View style={styles.page}>
        <Gutter side="left" />
        <Text style={styles.frontOverline}>the works of J.R.R. Tolkien</Text>
        <Text style={styles.frontTitle}>The Legendarium</Text>
        <View style={styles.rule} />
        <Text style={styles.frontProgress}>
          {readCount} of {TOTAL_WORKS} read
        </Text>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${pct}%` }]} />
        </View>
        <Text style={styles.frontPct}>{pct}% of the tale</Text>
      </View>
      <View style={styles.page}>
        <Gutter side="right" />
        <Text style={styles.contentsHead}>Contents</Text>
        {CATEGORIES.map((c, i) => {
          const items = WORKS.filter((w) => w.category === c.key);
          const readInGroup = items.filter((w) => readIds.has(w.id)).length;
          return (
            <Pressable
              key={c.key}
              onPress={() => onJump(i + 1)}
              style={styles.contentsRow}
              accessibilityRole="button"
              accessibilityLabel={`Turn to ${c.label}`}>
              <Text style={styles.contentsNum}>{roman(i + 1)}</Text>
              <Text style={styles.contentsLabel} numberOfLines={2}>
                {c.label}
              </Text>
              <Text style={styles.contentsCount}>
                {readInGroup}/{items.length}
              </Text>
            </Pressable>
          );
        })}
        <Text style={styles.contentsHint}>Turn the page to read on ›</Text>
      </View>
    </>
  );
}

/** A part of the legendarium: illuminated on the left, its works on the right. */
function PartSpread({ spread }: { spread: Spread }) {
  const { readIds } = useReading();
  const readInGroup = spread.items.filter((w) => readIds.has(w.id)).length;
  const pct = Math.round((readInGroup / spread.items.length) * 100);
  return (
    <>
      <View style={styles.page}>
        <Gutter side="left" />
        <View style={styles.dropCap}>
          <Text style={styles.dropCapText}>{spread.label.charAt(0)}</Text>
        </View>
        <Text style={styles.partLabel}>{spread.label}</Text>
        <Text style={styles.partBlurb}>{spread.blurb}</Text>
        <View style={styles.partFooter}>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${pct}%` }]} />
          </View>
          <Text style={styles.partCount}>
            {readInGroup} of {spread.items.length} read
          </Text>
        </View>
      </View>
      <View style={styles.page}>
        <Gutter side="right" />
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled>
          {spread.items.map((w) => (
            <WorkRow key={w.id} work={w} />
          ))}
        </ScrollView>
      </View>
    </>
  );
}

export function BookshelfPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { readCount } = useReading();
  const { height, width } = useWindowDimensions();
  const panelH = height * PANEL_RATIO;

  const [page, setPage] = useState(0);
  // The pager sits inside the leather padding, so it's narrower than the window;
  // measure it so each spread lines up with the real viewport.
  const [pagerW, setPagerW] = useState(width);

  // The row of spreads slides horizontally to turn pages; `turn` is that offset.
  const turn = useSharedValue(0);
  const startX = useSharedValue(0);

  const slide = useSharedValue(1);
  useEffect(() => {
    slide.value = withTiming(open ? 0 : 1, { duration: 400, easing: Easing.out(Easing.cubic) });
    if (!open) {
      setPage(0); // re-open to the title page next time
      turn.value = 0;
    }
  }, [open, slide, turn]);

  const rowStyle = useAnimatedStyle(() => ({ transform: [{ translateX: turn.value }] }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: slide.value * (panelH + 80) },
      { scale: interpolate(slide.value, [0, 1], [1, 0.92]) },
    ],
  }));
  const backdropStyle = useAnimatedStyle(() => ({ opacity: (1 - slide.value) * 0.55 }));

  const pct = Math.round((readCount / TOTAL_WORKS) * 100);
  const spreads = useMemo<Spread[]>(
    () => CATEGORIES.map((c) => ({ ...c, items: WORKS.filter((w) => w.category === c.key) })),
    [],
  );
  const pageCount = spreads.length + 1; // frontispiece + one per part

  const goTo = (index: number) => {
    const i = Math.max(0, Math.min(pageCount - 1, index));
    setPage(i);
    turn.value = withTiming(-i * pagerW, { duration: 460, easing: Easing.out(Easing.cubic) });
  };

  // Swipe left/right to turn the page: the spread follows the finger, then snaps.
  const pan = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-12, 12])
        .failOffsetY([-14, 14])
        .onStart(() => {
          startX.value = turn.value;
        })
        .onUpdate((e) => {
          const min = -(pageCount - 1) * pagerW;
          let next = startX.value + e.translationX;
          if (next > 0) next = next * 0.3; // rubber-band past the covers
          else if (next < min) next = min + (next - min) * 0.3;
          turn.value = next;
        })
        .onEnd((e) => {
          const current = pagerW > 0 ? -turn.value / pagerW : 0;
          let target = Math.round(current);
          if (e.velocityX < -500) target = Math.ceil(current);
          else if (e.velocityX > 500) target = Math.floor(current);
          target = Math.max(0, Math.min(pageCount - 1, target));
          turn.value = withSpring(-target * pagerW, { damping: 18, stiffness: 140, mass: 0.5 });
          runOnJS(setPage)(target);
        }),
    [pageCount, pagerW, turn, startX],
  );

  return (
    <View style={[StyleSheet.absoluteFill, { pointerEvents: open ? 'auto' : 'none' }]}>
      <AnimatedPressable style={[styles.backdrop, backdropStyle]} onPress={onClose} accessibilityLabel="Close the book" />
      <Animated.View style={[styles.sheet, { height: panelH }, sheetStyle]}>
        <View style={styles.spine} />
        <Pressable onPress={onClose} style={styles.close} accessibilityRole="button" accessibilityLabel="Close">
          <MaterialCommunityIcons name="close" size={18} color="#f2e6c8" />
        </Pressable>

        <GestureDetector gesture={pan}>
          <View style={styles.pager} onLayout={(e) => setPagerW(e.nativeEvent.layout.width)}>
            <Animated.View style={[styles.pagerRow, rowStyle]}>
              <View style={[styles.spread, { width: pagerW }]}>
                <Frontispiece pct={pct} onJump={goTo} />
              </View>
              {spreads.map((s) => (
                <View key={s.key} style={[styles.spread, { width: pagerW }]}>
                  <PartSpread spread={s} />
                </View>
              ))}
            </Animated.View>
            {/* The stacked fore-edges of the pages on each side of the open book. */}
            <View pointerEvents="none" style={styles.edgeStackL}>
              <LinearGradient
                colors={['rgba(120,92,50,0.4)', 'rgba(120,92,50,0)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </View>
            <View pointerEvents="none" style={styles.edgeStackR}>
              <LinearGradient
                colors={['rgba(120,92,50,0)', 'rgba(120,92,50,0.4)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </View>
          </View>
        </GestureDetector>
        <View pointerEvents="none" style={styles.ribbon} />

        <View style={styles.footer}>
          <Pressable
            onPress={() => goTo(page - 1)}
            disabled={page === 0}
            style={styles.chevron}
            accessibilityRole="button"
            accessibilityLabel="Previous page">
            <MaterialCommunityIcons name="chevron-left" size={22} color={page === 0 ? '#c8b090' : INK} />
          </Pressable>
          <View style={styles.dots}>
            {Array.from({ length: pageCount }).map((_, i) => (
              <View key={i} style={[styles.dot, i === page && styles.dotActive]} />
            ))}
          </View>
          <Pressable
            onPress={() => goTo(page + 1)}
            disabled={page === pageCount - 1}
            style={styles.chevron}
            accessibilityRole="button"
            accessibilityLabel="Next page">
            <MaterialCommunityIcons name="chevron-right" size={22} color={page === pageCount - 1 ? '#c8b090' : INK} />
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V'];
function roman(n: number) {
  return ROMAN[n] ?? String(n);
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: '#000' },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#3f2a15', // leather binding
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingTop: 10,
    paddingHorizontal: 6,
    paddingBottom: 6,
    borderWidth: 2,
    borderColor: '#25170a',
  },
  spine: { width: 46, height: 4, borderRadius: 3, backgroundColor: '#6b4a24', alignSelf: 'center', marginBottom: 8 },
  close: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 5,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(37,23,10,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  pager: { flex: 1, borderRadius: 6, overflow: 'hidden', borderWidth: 1, borderColor: '#6f4f27' },
  pagerRow: { flexDirection: 'row', height: '100%' },
  spread: { flexDirection: 'row', height: '100%', backgroundColor: '#efe7d2' },
  page: { flex: 1, backgroundColor: '#efe7d2', paddingHorizontal: 16, paddingVertical: 20, overflow: 'hidden' },
  gutter: { position: 'absolute', top: 0, bottom: 0, width: 26 },
  edgeStackL: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 9 },
  edgeStackR: { position: 'absolute', right: 0, top: 0, bottom: 0, width: 9 },
  ribbon: {
    position: 'absolute',
    top: 20,
    left: '50%',
    marginLeft: -4,
    width: 8,
    height: 150,
    backgroundColor: '#8a3324',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },

  // Frontispiece (title page)
  frontOverline: {
    fontFamily: AppFonts.bodyItalic,
    fontSize: 11,
    color: INK_SOFT,
    letterSpacing: 0.5,
    textTransform: 'lowercase',
  },
  frontTitle: { fontFamily: AppFonts.display, fontSize: 25, color: INK, marginTop: 6, lineHeight: 29 },
  rule: { height: 1, backgroundColor: '#c2ac78', marginVertical: 16 },
  frontProgress: { fontFamily: AppFonts.displayMedium, fontSize: 20, color: INK },
  frontPct: { fontFamily: AppFonts.bodyItalic, fontSize: 13, color: INK_SOFT, marginTop: 8 },

  // Contents page
  contentsHead: { fontFamily: AppFonts.display, fontSize: 24, color: INK, marginBottom: 14 },
  contentsRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, paddingVertical: 9 },
  contentsNum: { fontFamily: AppFonts.displayMedium, fontSize: 14, color: RUBRIC, width: 24 },
  contentsLabel: { fontFamily: AppFonts.body, fontSize: 14, color: INK, flex: 1 },
  contentsCount: { fontFamily: AppFonts.bodyMedium, fontSize: 13, color: GREEN },
  contentsHint: { fontFamily: AppFonts.bodyItalic, fontSize: 12, color: INK_SOFT, marginTop: 'auto' },

  // Part page (illuminated)
  dropCap: {
    width: 54,
    height: 54,
    borderRadius: 6,
    backgroundColor: RUBRIC,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  dropCapText: { fontFamily: AppFonts.display, fontSize: 38, color: '#f3e7c8', marginTop: -2 },
  partLabel: { fontFamily: AppFonts.display, fontSize: 24, color: INK, lineHeight: 27 },
  partBlurb: { fontFamily: AppFonts.bodyItalic, fontSize: 14, color: INK_SOFT, marginTop: 8, lineHeight: 20 },
  partFooter: { marginTop: 'auto' },
  partCount: { fontFamily: AppFonts.bodyMedium, fontSize: 13, color: INK, marginTop: 8 },

  // Works list (facing page)
  list: { flex: 1 },
  listContent: { paddingBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 8 },
  rowTitle: { fontFamily: AppFonts.body, fontSize: 14, color: INK_SOFT, flex: 1, lineHeight: 18 },
  rowTitleRead: { color: INK },
  rowYear: { fontFamily: AppFonts.body, fontSize: 12, color: '#a9986b' },

  // Shared progress bar
  track: { height: 7, backgroundColor: '#d3bd88', borderRadius: 4, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: GREEN, borderRadius: 4 },

  // Footer pager
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  chevron: {
    width: 38,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#e6d7b0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dots: { flexDirection: 'row', gap: 7, alignItems: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#6b4a24' },
  dotActive: { backgroundColor: '#f2e6c8', width: 8, height: 8, borderRadius: 4 },
});
