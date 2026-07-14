/**
 * The Trial — Mordor's quiz, revealed when you pass the great gate. One question
 * at a time; the fire marks the true answer. Slides up like the Shire's Bookshelf
 * and Rivendell's Compendium, so every region shares one shape. Real state: score
 * and progress, with a judgement at the end.
 */
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { TRIALS } from '@/data/trials';
import { AppFonts } from '@/theme/fonts';
import { getRegion } from '@/theme/regions';

const t = getRegion('mordor');
const PANEL_RATIO = 0.82;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const RIGHT = '#4a7a3a';
const RIGHT_BORDER = '#6fa03c';
const WRONG = '#7a2a22';
const WRONG_BORDER = '#a3402f';

function judgement(score: number, total: number): string {
  const pct = score / total;
  if (pct === 1) return 'The fire finds no fault in you.';
  if (pct >= 0.6) return 'You pass through the gate — for now.';
  if (pct > 0) return 'The shadows are not yet done with you.';
  return 'You are cast back into the dark.';
}

export function TrialPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { height } = useWindowDimensions();
  const panelH = height * PANEL_RATIO;
  const progress = useSharedValue(1);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    progress.value = withTiming(open ? 0 : 1, { duration: 380, easing: Easing.out(Easing.cubic) });
    if (open) {
      setIndex(0);
      setSelected(null);
      setScore(0);
      setDone(false);
    }
  }, [open, progress]);

  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: progress.value * (panelH + 80) }] }));
  const backdropStyle = useAnimatedStyle(() => ({ opacity: (1 - progress.value) * 0.55 }));

  const trial = TRIALS[index];
  const answered = selected !== null;
  const isLast = index === TRIALS.length - 1;

  const choose = (i: number) => {
    if (answered) return;
    setSelected(i);
    if (i === trial.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (isLast) {
      setDone(true);
    } else {
      setIndex((n) => n + 1);
      setSelected(null);
    }
  };

  const restart = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  };

  return (
    <View style={[StyleSheet.absoluteFill, { pointerEvents: open ? 'auto' : 'none' }]}>
      <AnimatedPressable style={[styles.backdrop, backdropStyle]} onPress={onClose} accessibilityLabel="Leave the trial" />
      <Animated.View style={[styles.sheet, { height: panelH }, sheetStyle]}>
        <View style={styles.grip} />
        <View style={styles.head}>
          <View style={styles.headText}>
            <Text style={styles.title}>The Trial</Text>
            <Text style={styles.tagline}>
              {done ? 'Judged' : `Question ${index + 1} of ${TRIALS.length}`} · {score} kept
            </Text>
          </View>
          <Pressable onPress={onClose} style={styles.close} accessibilityRole="button" accessibilityLabel="Close">
            <MaterialCommunityIcons name="close" size={20} color={t.accentSoft} />
          </Pressable>
        </View>

        {done ? (
          <View style={styles.result}>
            <MaterialCommunityIcons name="fire" size={40} color={t.accent} />
            <Text style={styles.resultScore}>
              {score} / {TRIALS.length}
            </Text>
            <Text style={styles.resultText}>{judgement(score, TRIALS.length)}</Text>
            <Pressable onPress={restart} style={styles.primaryBtn} accessibilityRole="button">
              <MaterialCommunityIcons name="restart" size={18} color="#f2ddd4" />
              <Text style={styles.primaryText}>Face it again</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.body}>
            <Text style={styles.question}>{trial.question}</Text>
            <View style={styles.options}>
              {trial.options.map((opt, i) => {
                const isAnswer = i === trial.answer;
                const isPicked = i === selected;
                let bg = t.surfaceAlt;
                let border = t.border;
                let color = t.text;
                if (answered && isAnswer) {
                  bg = RIGHT;
                  border = RIGHT_BORDER;
                  color = '#eafbe0';
                } else if (answered && isPicked && !isAnswer) {
                  bg = WRONG;
                  border = WRONG_BORDER;
                  color = '#fbe0da';
                } else if (answered) {
                  color = t.textMuted;
                }
                return (
                  <Pressable
                    key={opt}
                    onPress={() => choose(i)}
                    disabled={answered}
                    style={[styles.option, { backgroundColor: bg, borderColor: border }]}
                    accessibilityRole="button"
                    accessibilityLabel={opt}>
                    <Text style={[styles.optionText, { color }]}>{opt}</Text>
                    {answered && isAnswer ? (
                      <MaterialCommunityIcons name="check" size={18} color="#eafbe0" />
                    ) : answered && isPicked ? (
                      <MaterialCommunityIcons name="close" size={18} color="#fbe0da" />
                    ) : null}
                  </Pressable>
                );
              })}
            </View>

            {answered ? (
              <Pressable onPress={next} style={styles.primaryBtn} accessibilityRole="button">
                <Text style={styles.primaryText}>{isLast ? 'See your judgement' : 'Next trial'}</Text>
                <MaterialCommunityIcons name="arrow-right" size={18} color="#f2ddd4" />
              </Pressable>
            ) : null}
          </View>
        )}
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
    backgroundColor: '#200d09',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 18,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: t.border,
  },
  grip: { width: 40, height: 4, borderRadius: 3, backgroundColor: t.border, alignSelf: 'center', marginBottom: 10 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  headText: { flex: 1 },
  title: { fontFamily: AppFonts.display, fontSize: 28, color: t.accentSoft },
  tagline: { fontFamily: AppFonts.bodyItalic, fontSize: 13, color: t.textMuted, marginTop: -2 },
  close: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: t.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },

  body: { flex: 1 },
  question: { fontFamily: AppFonts.displayMedium, fontSize: 24, color: t.text, lineHeight: 30, marginBottom: 18 },
  options: { gap: 10 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  optionText: { fontFamily: AppFonts.body, fontSize: 17, flex: 1 },

  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 22,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: t.accent,
  },
  primaryText: { fontFamily: AppFonts.bodyMedium, fontSize: 16, color: '#f2ddd4' },

  result: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, paddingBottom: 40 },
  resultScore: { fontFamily: AppFonts.display, fontSize: 52, color: t.accentSoft },
  resultText: { fontFamily: AppFonts.bodyItalic, fontSize: 17, color: t.text, textAlign: 'center', paddingHorizontal: 20 },
});
