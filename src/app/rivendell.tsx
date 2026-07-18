/**
 * Rivendell — the Last Homely House as a hall you stand inside. A great stained
 * window pours pale light over ivy and tall shelves; a chandelier of candles
 * glimmers overhead. Tap the shelves to open the Compendium of lore, or the
 * stained window for the Annals of Arda and the lineages of the Half-elven; the
 * reading desk is still "soon".
 *
 * The hall is placeholder art — swap RivendellArt for the real image when it
 * lands and keep the hotspots' fractional positions.
 */
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AnnalsPanel } from '@/components/annals-panel';
import { Embers } from '@/components/embers';
import { LorePanel } from '@/components/lore-panel';
import { HearthGlow } from '@/components/scene/hearth-glow';
import { SceneToast } from '@/components/scene/scene-toast';
import { Hotspot, SceneOverlay, SceneView } from '@/components/scene/scene-view';

const RIVENDELL = require('../../assets/scenes/rivendell.jpg');

export default function RivendellScene() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [annalsOpen, setAnnalsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const say = useCallback((text: string) => setToast(text), []);

  // Tuned to the real art: shelves fill the left wall, the tall stained window is
  // centre-right, the reading desk sits lower-right under the candle.
  const hotspots: Hotspot[] = [
    { id: 'shelves', x: 0.0, y: 0.22, w: 0.36, h: 0.55, label: 'The great shelves', onPress: () => setPanelOpen(true) },
    { id: 'window', x: 0.46, y: 0.05, w: 0.37, h: 0.62, label: 'The stained window · Annals & lineages', onPress: () => setAnnalsOpen(true) },
    { id: 'desk', x: 0.55, y: 0.72, w: 0.44, h: 0.26, label: 'The reading desk', onPress: () => say('The reading desk · the day’s lore, soon') },
  ];

  return (
    <SceneView
      region="rivendell"
      image={RIVENDELL}
      title="Rivendell"
      subtitle="the Last Homely House"
      hotspots={hotspots}
      placeholder={<RivendellArt />}
      zoomed={panelOpen || annalsOpen}
      overlays={
        <SceneOverlay>
          <HearthGlow left="45%" top="5%" size={110} color="#ffe6a8" />
          <HearthGlow left="84%" top="61%" size={62} color="#ffcf7a" />
          <Embers count={12} color="rgba(220,240,235,0.55)" />
        </SceneOverlay>
      }>
      <SceneToast text={toast} onDone={() => setToast(null)} />
      <LorePanel open={panelOpen} onClose={() => setPanelOpen(false)} />
      <AnnalsPanel open={annalsOpen} onClose={() => setAnnalsOpen(false)} />
    </SceneView>
  );
}

/** Placeholder hall: pale gothic window, ivy, tall shelves, a chandelier, a desk. */
function RivendellArt() {
  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient colors={['#123138', '#0e262b', '#081619']} style={StyleSheet.absoluteFill} />

      <View style={styles.window}>
        <LinearGradient colors={['#e2ece8', '#b7cec8', '#59756d']} style={StyleSheet.absoluteFill} />
        <View style={[styles.mullion, { left: '33%' }]} />
        <View style={[styles.mullion, { left: '66%' }]} />
        <View style={styles.ivyL} />
        <View style={styles.ivyR} />
      </View>
      <View style={styles.rose}>
        <LinearGradient colors={['#dfe9e6', '#8fb0a8']} style={StyleSheet.absoluteFill} />
      </View>

      <View style={styles.shelf}>
        {[0, 1, 2, 3, 4].map((r) => (
          <View key={r} style={styles.shelfRow}>
            {Array.from({ length: 9 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.spine,
                  { height: `${55 + ((i * 37) % 40)}%`, backgroundColor: SPINES[(i + r) % SPINES.length] },
                ]}
              />
            ))}
          </View>
        ))}
      </View>

      <View style={styles.desk}>
        <View style={[styles.book, { left: '12%', backgroundColor: '#7a3a2a' }]} />
        <View style={[styles.book, { left: '40%', backgroundColor: '#3a5a6b' }]} />
        <View style={[styles.book, { left: '66%', backgroundColor: '#8a6a2a', height: 10 }]} />
      </View>

      <View style={styles.rug} />

      <View style={styles.chandelier}>
        {Array.from({ length: 11 }).map((_, i) => (
          <View key={i} style={styles.candle} />
        ))}
      </View>

      <View style={styles.foliage} />
    </View>
  );
}

const SPINES = ['#2d4a4a', '#5a4a2a', '#3a5a5f', '#6b3a3a', '#4a5a3a', '#3d4a6b'];

const styles = StyleSheet.create({
  window: {
    position: 'absolute',
    left: '50%',
    top: '8%',
    width: '34%',
    height: '54%',
    borderTopLeftRadius: 120,
    borderTopRightRadius: 120,
    overflow: 'hidden',
    borderWidth: 5,
    borderColor: '#33413d',
  },
  mullion: { position: 'absolute', top: 0, bottom: 0, width: 3, backgroundColor: '#33413d' },
  ivyL: { position: 'absolute', left: 0, top: '30%', bottom: 0, width: '18%', backgroundColor: 'rgba(30,60,40,0.55)' },
  ivyR: { position: 'absolute', right: 0, top: '20%', bottom: 0, width: '14%', backgroundColor: 'rgba(30,60,40,0.45)' },
  rose: {
    position: 'absolute',
    left: '61%',
    top: '3%',
    width: '12%',
    height: '7%',
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#33413d',
  },

  shelf: {
    position: 'absolute',
    left: '3%',
    top: '20%',
    width: '38%',
    height: '50%',
    backgroundColor: '#0c1c1f',
    borderRadius: 4,
    borderWidth: 3,
    borderColor: '#243a38',
    justifyContent: 'space-between',
    padding: 6,
  },
  shelfRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    height: '18%',
    borderBottomWidth: 3,
    borderBottomColor: '#1a2c2a',
  },
  spine: { flex: 1, borderRadius: 1 },

  desk: {
    position: 'absolute',
    left: '58%',
    top: '72%',
    width: '40%',
    height: '10%',
    backgroundColor: '#3a2a1c',
    borderRadius: 4,
  },
  book: { position: 'absolute', top: -8, width: '22%', height: 12, borderRadius: 2 },

  rug: {
    position: 'absolute',
    left: '20%',
    bottom: '2%',
    width: '60%',
    height: '16%',
    borderRadius: 60,
    backgroundColor: '#6b3f2e',
    opacity: 0.5,
  },

  chandelier: {
    position: 'absolute',
    left: '20%',
    top: '2%',
    width: '40%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  candle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffdf9a',
    shadowColor: '#ffcf7a',
    shadowOpacity: 0.9,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },

  foliage: {
    position: 'absolute',
    right: 0,
    top: '46%',
    width: '14%',
    height: '30%',
    borderTopLeftRadius: 60,
    borderBottomLeftRadius: 40,
    backgroundColor: '#8a5a1e',
    opacity: 0.6,
  },
});
