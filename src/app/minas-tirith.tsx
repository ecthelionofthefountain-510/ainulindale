/**
 * Minas Tirith — the White City of Gondor, seven tiers of stone climbing to the
 * Tower of Ecthelion. You look up at the citadel at dawn; enter the great hall to
 * see your deeds graven in stone, or look up to the Tower of Ecthelion for the
 * Archives — your reading tallied. The White Tree is still "soon".
 *
 * Placeholder art — swap MinasTirithArt for the real image and keep the hotspots.
 */
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AchievementsPanel } from '@/components/achievements-panel';
import { ArchivesPanel } from '@/components/archives-panel';
import { Embers } from '@/components/embers';
import { HearthGlow } from '@/components/scene/hearth-glow';
import { SceneToast } from '@/components/scene/scene-toast';
import { Hotspot, SceneOverlay, SceneView } from '@/components/scene/scene-view';

const MINAS_TIRITH = require('../../assets/scenes/minas-tirith.jpg');

export default function MinasTirithScene() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [archivesOpen, setArchivesOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const say = useCallback((text: string) => setToast(text), []);

  // Tuned to the real art: the Hall of the Kings entrance is centre, the Tower of
  // Ecthelion rises upper-centre, the White Tree stands in the fountain lower-left.
  const hotspots: Hotspot[] = [
    { id: 'hall', x: 0.3, y: 0.46, w: 0.44, h: 0.32, label: 'The great hall · deeds', onPress: () => setPanelOpen(true) },
    { id: 'tower', x: 0.37, y: 0.05, w: 0.22, h: 0.4, label: 'The Tower of Ecthelion · the Archives', onPress: () => setArchivesOpen(true) },
    { id: 'tree', x: 0.14, y: 0.54, w: 0.27, h: 0.34, label: 'The White Tree', onPress: () => say('The White Tree · your streaks, soon') },
  ];

  return (
    <SceneView
      region="minas-tirith"
      image={MINAS_TIRITH}
      title="Minas Tirith"
      subtitle="the deeds you are remembered by"
      hotspots={hotspots}
      placeholder={<MinasTirithArt />}
      zoomed={panelOpen || archivesOpen}
      overlays={
        <SceneOverlay>
          <HearthGlow left="76%" top="24%" size={150} color="#ffe6b0" />
          <Embers count={10} color="rgba(240,244,255,0.7)" />
        </SceneOverlay>
      }>
      <SceneToast text={toast} onDone={() => setToast(null)} />
      <AchievementsPanel open={panelOpen} onClose={() => setPanelOpen(false)} />
      <ArchivesPanel open={archivesOpen} onClose={() => setArchivesOpen(false)} />
    </SceneView>
  );
}

/** Seven tiers of the White City (percent top/width), narrowing upward from the base. */
const TIERS = [
  { top: 58, width: 78 },
  { top: 50, width: 68 },
  { top: 42, width: 58 },
  { top: 34, width: 48 },
  { top: 27, width: 38 },
  { top: 21, width: 28 },
  { top: 16, width: 20 },
];

/** Placeholder Minas Tirith: dawn sky, Mount Mindolluin, the white tiered city, a spire. */
function MinasTirithArt() {
  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient colors={['#1b2740', '#38456a', '#b9a06a']} style={StyleSheet.absoluteFill} />

      <View style={styles.mountain} />
      <View style={styles.mountainSnow} />

      {TIERS.map((tier, i) => (
        <View
          key={i}
          style={[
            styles.tier,
            { top: `${tier.top}%`, width: `${tier.width}%`, left: `${(100 - tier.width) / 2}%` },
          ]}
        />
      ))}

      <View style={styles.spire}>
        <View style={styles.spireTip} />
      </View>

      <View style={styles.tree}>
        <View style={styles.treeCanopy} />
        <View style={styles.treeTrunk} />
      </View>

      <View style={styles.foreground} />
    </View>
  );
}

const styles = StyleSheet.create({
  mountain: {
    position: 'absolute',
    left: '-10%',
    top: '-8%',
    width: '80%',
    height: '70%',
    backgroundColor: '#3a4256',
    opacity: 0.6,
    borderBottomRightRadius: 260,
  },
  mountainSnow: {
    position: 'absolute',
    left: '2%',
    top: '-2%',
    width: '46%',
    height: '30%',
    backgroundColor: '#c9d0de',
    opacity: 0.35,
    borderBottomRightRadius: 160,
  },

  tier: {
    position: 'absolute',
    height: '10%',
    backgroundColor: '#e9e7dd',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
    borderColor: '#c2bfae',
    opacity: 0.96,
  },
  spire: {
    position: 'absolute',
    left: '48%',
    top: '8%',
    width: '4%',
    height: '12%',
    backgroundColor: '#f1efe6',
    alignItems: 'center',
  },
  spireTip: {
    position: 'absolute',
    top: -12,
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderBottomWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#e8cf82',
  },

  tree: { position: 'absolute', left: '33%', top: '66%', width: '10%', alignItems: 'center' },
  treeCanopy: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#dfe6e0',
    opacity: 0.9,
  },
  treeTrunk: { width: 4, height: 16, backgroundColor: '#b9c0bd', marginTop: -2 },

  foreground: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '22%',
    backgroundColor: '#20283b',
    opacity: 0.92,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 40,
  },
});
