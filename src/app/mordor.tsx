/**
 * Mordor — a descent into the dark. You stand deep in a stone fortress: torches
 * gutter on the walls, a forge-glow seeps up from below, and a great iron gate
 * bars the way down. Pass the gate to face the Trial; the brazier and the far
 * tower are "soon", so the room reads like the Shire's and Rivendell's.
 *
 * Placeholder art — swap MordorArt for the real image and keep the hotspots.
 */
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Embers } from '@/components/embers';
import { HearthGlow } from '@/components/scene/hearth-glow';
import { SceneToast } from '@/components/scene/scene-toast';
import { Hotspot, SceneOverlay, SceneView } from '@/components/scene/scene-view';
import { TrialPanel } from '@/components/trial-panel';

const MORDOR = require('../../assets/scenes/mordor.jpg');

export default function MordorScene() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const say = useCallback((text: string) => setToast(text), []);

  // Tuned to the real art: the forge-lit iron gate fills the centre, the wall
  // torch is on the left, the dark tower stands in the archway upper-right.
  const hotspots: Hotspot[] = [
    { id: 'gate', x: 0.26, y: 0.5, w: 0.48, h: 0.36, label: 'The iron gate', onPress: () => setPanelOpen(true) },
    { id: 'brazier', x: 0.02, y: 0.36, w: 0.24, h: 0.2, label: 'The torch', onPress: () => say('The brazier · your streak of trials, soon') },
    { id: 'tower', x: 0.54, y: 0.07, w: 0.36, h: 0.36, label: 'The dark tower', onPress: () => say('The tower · deeper, darker tiers, soon') },
  ];

  return (
    <SceneView
      region="mordor"
      image={MORDOR}
      title="Mordor"
      subtitle="prove your lore in the fire"
      hotspots={hotspots}
      placeholder={<MordorArt />}
      zoomed={panelOpen}
      overlays={
        <SceneOverlay>
          <HearthGlow left="40%" top="78%" size={200} color="#ff5a1e" />
          <HearthGlow left="6%" top="37%" size={80} color="#ff8a2e" />
          <Embers count={22} color="#ff6a3f" />
        </SceneOverlay>
      }>
      <SceneToast text={toast} onDone={() => setToast(null)} />
      <TrialPanel open={panelOpen} onClose={() => setPanelOpen(false)} />
    </SceneView>
  );
}

/** Placeholder fortress: ash walls, a dark tower, a bridge, a forge-lit iron gate. */
function MordorArt() {
  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient colors={['#241310', '#180b08', '#0f0605']} style={StyleSheet.absoluteFill} />
      <LinearGradient
        colors={['transparent', 'rgba(120,40,10,0.35)', 'rgba(200,70,15,0.5)']}
        style={styles.forgeBand}
      />

      <View style={styles.wallL} />
      <View style={styles.wallR} />

      <View style={styles.tower}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={styles.merlon} />
        ))}
      </View>

      <View style={styles.bridge} />

      <View style={styles.gate}>
        {Array.from({ length: 6 }).map((_, i) => (
          <View key={i} style={styles.bar} />
        ))}
      </View>

      <View style={styles.torchL} />
    </View>
  );
}

const styles = StyleSheet.create({
  forgeBand: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '34%' },

  wallL: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '20%',
    height: '78%',
    backgroundColor: '#1a0e0a',
    borderRightWidth: 2,
    borderColor: '#3a1c14',
  },
  wallR: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: '16%',
    height: '64%',
    backgroundColor: '#160c09',
    borderLeftWidth: 2,
    borderColor: '#3a1c14',
  },

  tower: {
    position: 'absolute',
    left: '58%',
    top: '10%',
    width: '20%',
    height: '40%',
    backgroundColor: '#140a07',
    borderWidth: 2,
    borderColor: '#33150e',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingTop: 4,
  },
  merlon: { width: '22%', height: 10, backgroundColor: '#33150e', marginTop: -8 },

  bridge: {
    position: 'absolute',
    left: '18%',
    top: '46%',
    width: '54%',
    height: 12,
    backgroundColor: '#2a150e',
    borderRadius: 2,
  },

  gate: {
    position: 'absolute',
    left: '28%',
    top: '62%',
    width: '44%',
    height: '32%',
    backgroundColor: '#0c0503',
    borderTopLeftRadius: 90,
    borderTopRightRadius: 90,
    borderWidth: 3,
    borderColor: '#3a1c12',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
    paddingBottom: 6,
    overflow: 'hidden',
  },
  bar: { width: 4, height: '82%', backgroundColor: '#2c1811', borderRadius: 2 },

  torchL: {
    position: 'absolute',
    left: '12%',
    top: '34%',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffb347',
    shadowColor: '#ff7a1a',
    shadowOpacity: 0.9,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
});
