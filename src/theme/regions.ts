/**
 * The regions of Arda. Each region is a mood: its own palette, gradient sky and
 * glow. Screens adopt a region so the whole app "feels" like where you are.
 */

export type RegionKey = 'arda' | 'shire' | 'rivendell' | 'mordor' | 'minas-tirith';

export interface RegionTheme {
  key: RegionKey;
  /** Display name shown in headers. */
  name: string;
  /** Small line under the name. */
  tagline: string;
  /** Status-bar content colour. */
  mode: 'dark' | 'light';
  /** Background gradient, top to bottom (>= 2 stops). */
  sky: readonly [string, string, ...string[]];
  /** Card / panel background. */
  surface: string;
  /** Slightly raised or alternate surface. */
  surfaceAlt: string;
  border: string;
  text: string;
  textMuted: string;
  /** Primary accent (borders, active states). */
  accent: string;
  /** Softer accent (secondary highlights). */
  accentSoft: string;
  /** Colour used for glows / pins / embers. */
  glow: string;
}

export const REGIONS: Record<RegionKey, RegionTheme> = {
  arda: {
    key: 'arda',
    name: 'Arda',
    tagline: 'The world that is',
    mode: 'dark',
    sky: ['#0a0e24', '#13203a', '#1c2f3a'],
    surface: 'rgba(20,32,52,0.62)',
    surfaceAlt: 'rgba(30,46,70,0.7)',
    border: '#2c4258',
    text: '#e9d9a8',
    textMuted: '#8a97b8',
    accent: '#f0d789',
    accentSoft: '#cbd6f0',
    glow: '#f0d789',
  },
  shire: {
    key: 'shire',
    name: 'The Shire',
    tagline: 'Your bookshelf',
    mode: 'light',
    sky: ['#f5ecd6', '#e7d8b3'],
    surface: '#eaddbb',
    surfaceAlt: '#e0cfa0',
    border: '#cdb884',
    text: '#4a3b1c',
    textMuted: '#8a7444',
    accent: '#5f7a2e',
    accentSoft: '#6fa03c',
    glow: '#7cc47a',
  },
  rivendell: {
    key: 'rivendell',
    name: 'Rivendell',
    tagline: 'Lore of Arda',
    mode: 'dark',
    sky: ['#0e1c22', '#16323a', '#1d3f43'],
    surface: '#173035',
    surfaceAlt: '#1f4248',
    border: '#2f5a5a',
    text: '#e6f0ea',
    textMuted: '#8fb4ad',
    accent: '#8fdcc9',
    accentSoft: '#e0c987',
    glow: '#8fdcc9',
  },
  mordor: {
    key: 'mordor',
    name: 'Mordor',
    tagline: 'The trial',
    mode: 'dark',
    sky: ['#1a0a08', '#2c0f0b', '#3d130c'],
    surface: '#2a100c',
    surfaceAlt: '#3a1712',
    border: '#5a201a',
    text: '#f2ddd4',
    textMuted: '#b06a58',
    accent: '#e0603f',
    accentSoft: '#f0a06e',
    glow: '#e0603f',
  },
  'minas-tirith': {
    key: 'minas-tirith',
    name: 'Minas Tirith',
    tagline: 'Your deeds remembered',
    mode: 'dark',
    // Gondor at dawn: twilight blue stone lifting toward a gold sky, silver + gold accents.
    sky: ['#161e33', '#28324f', '#55618a'],
    surface: '#222b43',
    surfaceAlt: '#2d3958',
    border: '#45537d',
    text: '#f0efe6',
    textMuted: '#9aa6c4',
    accent: '#e8cf82',
    accentSoft: '#cdd6ec',
    glow: '#f0dd9a',
  },
};

export function getRegion(key: RegionKey): RegionTheme {
  return REGIONS[key];
}
