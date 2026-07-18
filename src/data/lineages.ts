/**
 * The Houses of Middle-earth — genealogies kept behind Rivendell's window. Each
 * house is one legible line of descent, read top (ancestors) to bottom, so a
 * reader can pick a single house rather than drown in the whole web at once.
 *
 * The renderer draws three kinds of node: a 'line' (a person or a union A ⚭ B),
 * a 'fork' (a house splitting into two branches), and a 'reunion' (a highlighted
 * culminating figure or joining). Keep each house short; easy to add more.
 */

export interface LinePerson {
  /** One name, or a union written "A  ⚭  B". */
  names: string;
  /** A short line of who they are. */
  epithet?: string;
  note: string;
}

export type LineNode =
  | ({ kind: 'line' } & LinePerson)
  | { kind: 'fork'; heading: string; note: string; left: LinePerson; right: LinePerson }
  | ({ kind: 'reunion' } & LinePerson);

export interface Lineage {
  id: string;
  /** Short name for the filter chip. */
  chip: string;
  title: string;
  subtitle: string;
  nodes: LineNode[];
}

export const LINEAGES: Lineage[] = [
  {
    id: 'half-elven',
    chip: 'Half-elven',
    title: 'The Half-elven',
    subtitle: 'the Peredhil · Elrond’s own line',
    nodes: [
      {
        kind: 'line',
        names: 'Beren  ⚭  Lúthien',
        epithet: 'a mortal Man · an Elf-maid of Doriath',
        note: 'The first union of the Two Kindreds. For love of Beren, Lúthien chose to become mortal and share his fate.',
      },
      {
        kind: 'line',
        names: 'Dior Eluchíl',
        epithet: 'their son, heir of Doriath',
        note: 'To him passed the Silmaril that Beren and Lúthien had wrested from the Iron Crown.',
      },
      {
        kind: 'line',
        names: 'Elwing  ⚭  Eärendil',
        epithet: 'Dior’s daughter · son of Tuor & Idril of Gondolin',
        note: 'Two half-elven houses joined. Bearing the Silmaril, Eärendil sailed to Valinor to plead for the aid that ended the First Age.',
      },
      {
        kind: 'fork',
        heading: 'Elrond  &  Elros',
        note: 'The Peredhil, the Half-elven. To them alone the Valar granted a choice of kindreds.',
        left: {
          names: 'Elros Tar-Minyatur',
          epithet: 'chose the fate of Men',
          note: 'First King of Númenor. His line endured through the Dúnedain to the Chieftains of the North.',
        },
        right: {
          names: 'Elrond Half-elven',
          epithet: 'chose the Firstborn',
          note: 'Master of Rivendell, keeper of Vilya. Father of Arwen Undómiel.',
        },
      },
      {
        kind: 'reunion',
        names: 'Aragorn  ⚭  Arwen',
        epithet: 'heir of Elros · daughter of Elrond',
        note: 'After an Age apart, the sundered lines of the Half-elven were joined again — and, as Lúthien before her, Arwen chose a mortal life.',
      },
    ],
  },
  {
    id: 'finwe',
    chip: 'House of Finwë',
    title: 'The House of Finwë',
    subtitle: 'the princes of the Noldor',
    nodes: [
      {
        kind: 'line',
        names: 'Finwë',
        epithet: 'High King of the Noldor',
        note: 'Led the Noldor to Aman in the Elder Days. First of the Eldar to be slain, by Melkor, for the Silmarils.',
      },
      {
        kind: 'fork',
        heading: 'The sons of Finwë',
        note: 'From his sons sprang the royal houses of the Noldor, and the long strife over the Silmarils.',
        left: {
          names: 'Fëanor',
          epithet: 'eldest; maker of the Silmarils',
          note: 'His Oath and his seven sons drove the Noldor into exile and the wars of Beleriand.',
        },
        right: {
          names: 'Fingolfin  &  Finarfin',
          epithet: 'the younger houses',
          note: 'Fingolfin became High King in exile; Finarfin alone remained in Aman.',
        },
      },
      {
        kind: 'line',
        names: 'The princes of the Noldor',
        epithet: 'the grandchildren of Finwë',
        note: 'Fingon, Turgon and Aredhel of Fingolfin’s house; Finrod, Orodreth, Angrod, Aegnor and Galadriel of Finarfin’s.',
      },
      {
        kind: 'reunion',
        names: 'Galadriel',
        epithet: 'last of the house in Middle-earth',
        note: 'Wed Celeborn of Doriath; through her daughter Celebrían, mother of Arwen, the house of Finwë joins the Half-elven.',
      },
    ],
  },
  {
    id: 'elros',
    chip: 'Line of Elros',
    title: 'The Line of Elros',
    subtitle: 'Kings of Númenor to the Reunited Realm',
    nodes: [
      {
        kind: 'line',
        names: 'Elros Tar-Minyatur',
        epithet: 'first King of Númenor',
        note: 'Chose to be counted among Men, and was granted a life of many hundred years to rule the Star-isle.',
      },
      {
        kind: 'line',
        names: 'The Kings of Númenor',
        epithet: 'the sceptre of the Sea-kings',
        note: 'The line ruled the isle through the Second Age, until pride and the shadow of Sauron divided the Faithful from the King’s Men.',
      },
      {
        kind: 'line',
        names: 'Elendil the Tall',
        epithet: 'lord of the Faithful',
        note: 'Escaped the Downfall with his sons and nine ships, and founded Arnor and Gondor in exile.',
      },
      {
        kind: 'fork',
        heading: 'Isildur  &  Anárion',
        note: 'Elendil’s sons, who ruled the realms-in-exile together and fell in the war against Sauron.',
        left: {
          names: 'Isildur',
          epithet: 'the North-realm; the Ring',
          note: 'Cut the One Ring from Sauron’s hand. His heirs dwindled to the Chieftains of the Dúnedain.',
        },
        right: {
          names: 'Anárion',
          epithet: 'the South-realm',
          note: 'His line held Gondor’s throne until it failed, and the Stewards ruled in the kings’ stead.',
        },
      },
      {
        kind: 'reunion',
        names: 'Aragorn Elessar',
        epithet: 'Isildur’s heir, the thirty-ninth',
        note: 'Claimed both crowns and joined Arnor and Gondor once more as the Reunited Realm.',
      },
    ],
  },
  {
    id: 'stewards',
    chip: 'Stewards',
    title: 'The Stewards of Gondor',
    subtitle: 'the House of Húrin, rulers in the kings’ stead',
    nodes: [
      {
        kind: 'line',
        names: 'Mardil Voronwë',
        epithet: 'the first Ruling Steward',
        note: 'When the line of kings failed, Mardil the Faithful took up the rule of Gondor, holding the throne in trust.',
      },
      {
        kind: 'line',
        names: 'The Ruling Stewards',
        epithet: 'twenty-six in the line',
        note: 'For near a thousand years they governed Gondor, awaiting a king who did not come.',
      },
      {
        kind: 'fork',
        heading: 'Denethor II',
        note: 'The last Ruling Steward, and his two sons who rode to the War of the Ring.',
        left: {
          names: 'Boromir',
          epithet: 'the elder',
          note: 'Fell defending Merry and Pippin at Amon Hen, redeeming his brief fall to the Ring.',
        },
        right: {
          names: 'Faramir',
          epithet: 'the younger',
          note: 'Captain of Ithilien, who let the Ring pass; made Prince of Ithilien by the returned King.',
        },
      },
      {
        kind: 'reunion',
        names: 'Faramir  ⚭  Éowyn',
        epithet: 'Steward of Gondor · Lady of Rohan',
        note: 'Their union bound Gondor to the Mark, and the Stewards served the Reunited Realm into the Fourth Age.',
      },
    ],
  },
  {
    id: 'eorl',
    chip: 'House of Eorl',
    title: 'The House of Eorl',
    subtitle: 'Kings of the Riddermark',
    nodes: [
      {
        kind: 'line',
        names: 'Eorl the Young',
        epithet: 'first King of the Mark',
        note: 'Rode to Gondor’s aid at the Field of Celebrant and was granted the green land of Rohan for his people.',
      },
      {
        kind: 'line',
        names: 'The line of the Mark',
        epithet: 'the horse-lords',
        note: 'Eorl’s house held Rohan through long years, ever watchful of the wild and, at the last, of Isengard.',
      },
      {
        kind: 'fork',
        heading: 'The house of Thengel',
        note: 'Thengel, sixteenth king, and his children.',
        left: {
          names: 'Théoden',
          epithet: 'King of Rohan',
          note: 'His son Théodred fell at the Fords of Isen. Freed from Saruman’s spell, Théoden rode to glory and death on the Pelennor.',
        },
        right: {
          names: 'Théodwyn  ⚭  Éomund',
          epithet: 'the king’s sister',
          note: 'Their orphaned children were taken in by Théoden and raised as his own.',
        },
      },
      {
        kind: 'line',
        names: 'Éomer  &  Éowyn',
        epithet: 'Théodwyn’s children',
        note: 'Éomer became King after Théoden; Éowyn, the White Lady, cut down the Witch-king on the Pelennor Fields.',
      },
      {
        kind: 'reunion',
        names: 'Éowyn  ⚭  Faramir',
        epithet: 'of Rohan · Steward of Gondor',
        note: 'Their marriage bound the Mark to Gondor, and Éomer’s house rode on into the Fourth Age.',
      },
    ],
  },
  {
    id: 'hador',
    chip: 'House of Hador',
    title: 'The House of Hador',
    subtitle: 'the Edain of the First Age',
    nodes: [
      {
        kind: 'line',
        names: 'Hador Lórindol',
        epithet: 'lord of Dor-lómin',
        note: 'Golden-haired chief of the Third House of the Edain, and a friend of the Noldor in the wars of Beleriand.',
      },
      {
        kind: 'line',
        names: 'Galdor the Tall',
        epithet: 'his son',
        note: 'Held Dor-lómin against the might of Morgoth in the long defeat of the North.',
      },
      {
        kind: 'fork',
        heading: 'Húrin  &  Huor',
        note: 'Galdor’s sons, who stood together at the Nírnaeth Arnoediad, the Battle of Unnumbered Tears.',
        left: {
          names: 'Húrin Thalion',
          epithet: 'the steadfast',
          note: 'Defied Morgoth to the end. His son was Túrin Turambar, whose life the Dark Lord’s curse unmade.',
        },
        right: {
          names: 'Huor',
          epithet: 'fell at the Nírnaeth',
          note: 'His son was Tuor, who alone was led to the hidden city of Gondolin.',
        },
      },
      {
        kind: 'reunion',
        names: 'Tuor  ⚭  Idril',
        epithet: 'of the House of Hador · princess of Gondolin',
        note: 'From their union came Eärendil the Mariner — and so this house flows on into the line of the Half-elven.',
      },
    ],
  },
  {
    id: 'durin',
    chip: 'House of Durin',
    title: 'The House of Durin',
    subtitle: 'Kings of Durin’s Folk',
    nodes: [
      {
        kind: 'line',
        names: 'Durin the Deathless',
        epithet: 'eldest of the Seven Fathers',
        note: 'Awoke alone in the Elder Days and founded Khazad-dûm. His likeness was reborn in his line down all the ages.',
      },
      {
        kind: 'line',
        names: 'The Kings under the Mountain',
        epithet: 'the Longbeards',
        note: 'Durin’s folk delved Khazad-dûm and later Erebor, richest of dwarf-realms — until a Balrog, and then a dragon, drove them out.',
      },
      {
        kind: 'line',
        names: 'Thrór',
        epithet: 'King under the Mountain',
        note: 'Ruled Erebor until Smaug the Golden came. Later slain in Moria by the orc Azog, kindling the War of the Dwarves and Orcs.',
      },
      {
        kind: 'fork',
        heading: 'Thráin’s kin',
        note: 'Thráin II lost his ring and vanished in Dol Guldur; the kingship passed among his kin.',
        left: {
          names: 'Thorin II Oakenshield',
          epithet: 'led the quest for Erebor',
          note: 'Retook the Lonely Mountain and fell in the Battle of Five Armies, with his heirs Fíli and Kíli.',
        },
        right: {
          names: 'Dáin II Ironfoot',
          epithet: 'his kinsman of the Iron Hills',
          note: 'Came to the Battle of Five Armies, and after Thorin’s fall became King under the Mountain.',
        },
      },
      {
        kind: 'reunion',
        names: 'Durin VII',
        epithet: 'the Last',
        note: 'It was foretold that an heir named Durin would come again, and lead Durin’s Folk back to Khazad-dûm.',
      },
    ],
  },
  {
    id: 'shire',
    chip: 'The Shire',
    title: 'The Baggins Kin',
    subtitle: 'the Ring-bearers of the Shire',
    nodes: [
      {
        kind: 'line',
        names: 'Gerontius Took',
        epithet: 'the Old Took, Thain of the Shire',
        note: 'Long-lived father of a great line; through his children the Tooks, Bagginses and Brandybucks were bound together.',
      },
      {
        kind: 'fork',
        heading: 'The Baggins branches',
        note: 'Two Baggins households, both descended from the Old Took’s kin.',
        left: {
          names: 'Bungo  ⚭  Belladonna Took',
          epithet: 'of Bag End',
          note: 'Built Bag End, and were the parents of Bilbo Baggins, finder of the Ring.',
        },
        right: {
          names: 'Drogo  ⚭  Primula Brandybuck',
          epithet: 'Baggins & Brandybuck',
          note: 'Parents of Frodo, orphaned young and later taken by Bilbo as his heir.',
        },
      },
      {
        kind: 'reunion',
        names: 'Bilbo  &  Frodo',
        epithet: 'the Ring-bearers',
        note: 'Bilbo found the Ring and Frodo bore it to the Fire. With Sam, Merry and Pippin beside them, hobbits passed into the great tales.',
      },
    ],
  },
];
