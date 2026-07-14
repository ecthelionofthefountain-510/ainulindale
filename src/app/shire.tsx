/**
 * The Shire — Bag End as a living room you stand inside. Tilt to look around;
 * the hearth breathes and dust drifts in the window light. Tap the bookshelf to
 * open your reading log; the window, hearth and chair are where lore, trials and
 * your journey will live — "soon" for now, so the pattern reads across the app.
 */
import { useCallback, useState } from 'react';

import { BookshelfPanel } from '@/components/bookshelf-panel';
import { Embers } from '@/components/embers';
import { HearthGlow } from '@/components/scene/hearth-glow';
import { SceneToast } from '@/components/scene/scene-toast';
import { Hotspot, SceneOverlay, SceneView } from '@/components/scene/scene-view';
import { WindowBreeze } from '@/components/scene/window-breeze';

const BAG_END = require('../../assets/scenes/bag-end.jpg');

export default function ShireScene() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const say = useCallback((text: string) => setToast(text), []);

  // Coordinates tuned to the real Bag End art: shelves left, round window upper
  // right (a touch lower/centred), stone hearth lower left, armchair centre-right.
  const hotspots: Hotspot[] = [
    { id: 'bookshelf', x: 0.02, y: 0.13, w: 0.38, h: 0.39, label: 'The bookshelf', onPress: () => setPanelOpen(true) },
    { id: 'window', x: 0.54, y: 0.24, w: 0.42, h: 0.26, label: 'The round window', onPress: () => say('The window · the lore of Rivendell, soon') },
    { id: 'hearth', x: 0.0, y: 0.53, w: 0.28, h: 0.29, label: 'The hearth', onPress: () => say('The hearth · the trials of Mordor, soon') },
    { id: 'chair', x: 0.42, y: 0.52, w: 0.55, h: 0.36, label: 'The reading chair', onPress: () => say('The reading chair · your journey, soon') },
  ];

  return (
    <SceneView
      region="shire"
      image={BAG_END}
      title="Bag End"
      subtitle="the Shire"
      hotspots={hotspots}
      zoomed={panelOpen}
      overlays={
        <SceneOverlay>
          <WindowBreeze left="55%" top="33%" width="40%" />
          <HearthGlow left="-7%" top="62%" size={130} />
          <HearthGlow left="37%" top="53%" size={40} color="#ffd98a" />
          <Embers count={10} color="rgba(255,238,200,0.5)" />
        </SceneOverlay>
      }>
      <SceneToast text={toast} onDone={() => setToast(null)} />
      <BookshelfPanel open={panelOpen} onClose={() => setPanelOpen(false)} />
    </SceneView>
  );
}
