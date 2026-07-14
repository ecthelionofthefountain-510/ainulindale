/**
 * Lore of Arda — the "did you know" entries kept in Rivendell's compendium.
 * A starting handful, easy to grow. Keep bodies short enough to read at a glance.
 */

export interface LoreEntry {
  id: string;
  title: string;
  body: string;
}

export const LORE: LoreEntry[] = [
  {
    id: 'mairon',
    title: 'Sauron was once Mairon',
    body: 'The Dark Lord began as a Maia of Aulë the Smith, named Mairon — “the Admirable” — before Melkor drew him into shadow.',
  },
  {
    id: 'three-rings',
    title: 'The Three were kept hidden',
    body: 'Narya, Nenya and Vilya were forged by Celebrimbor without Sauron’s hand, and so stayed unstained. They were never used while he held the One.',
  },
  {
    id: 'imladris',
    title: 'Rivendell is Imladris',
    body: 'Elrond founded the Last Homely House in the Second Age, a refuge in a hidden valley east of the Misty Mountains — “the cloven dell”.',
  },
  {
    id: 'earendil',
    title: 'A Silmaril sails the sky',
    body: 'Eärendil bears a Silmaril bound to his brow as he sails the heavens. His light is the Morning and Evening Star — the one Galadriel gives to Frodo.',
  },
  {
    id: 'ents',
    title: 'The Ents were taught to speak',
    body: 'The tree-herds were awoken and taught language by the Elves in the deeps of time. Treebeard is among the oldest living things in Middle-earth.',
  },
  {
    id: 'mithril',
    title: 'Bilbo’s coat outvalued the Shire',
    body: 'Mithril was mined only in Moria. The small coat Bilbo passed to Frodo was said to be worth more than the whole of the Shire.',
  },
];
