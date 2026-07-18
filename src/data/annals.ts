/**
 * The Annals of Arda — the Ages of the World, read through Rivendell's stained
 * window (Elrond, who remembers them all). A vertical timeline: eras, each with a
 * handful of turning-point events. It opens before time itself, with the Music of
 * the Ainur, and runs to the Dominion of Men. Dates follow Tolkien's reckoning —
 * the early ages are given as mood, not number; the First Age counts from the
 * first Sunrise. Keep bodies short enough to read at a glance; easy to grow.
 */

export interface AnnalEvent {
  /** Short reckoning tag, e.g. "S.A. 3441" or "the Elder Days". */
  year: string;
  title: string;
  body: string;
}

export interface AnnalEra {
  id: string;
  /** The Age's name. */
  name: string;
  /** Roughly how long it lasted. */
  span: string;
  /** One line of mood for the Age. */
  note: string;
  events: AnnalEvent[];
}

export const ANNALS: AnnalEra[] = [
  {
    id: 'ainulindale',
    name: 'The Ainulindalë',
    span: 'before time',
    note: 'The Music of the Ainur, from which the World was made.',
    events: [
      {
        year: 'the Timeless Halls',
        title: 'Ilúvatar and the Ainur',
        body: 'Eru Ilúvatar, the One, kindles the Ainur from his thought, and to each he offers themes of music to sing before him.',
      },
      {
        year: 'the Great Music',
        title: 'The Music of the Ainur',
        body: 'In three themes the Ainur make a mighty song. Melkor weaves in discord of his own, and thrice Ilúvatar answers it and turns it to his design.',
      },
      {
        year: 'the Vision',
        title: 'The World is shown',
        body: 'Ilúvatar unveils a vision of the World their Music has wrought — its ages, its seas and lands, and the coming of Elves and Men.',
      },
      {
        year: 'Eä',
        title: 'The World that Is',
        body: 'Ilúvatar speaks the word Eä — “Let these things Be!” — and kindles the Flame Imperishable at the heart of the World, and it begins to be.',
      },
    ],
  },
  {
    id: 'lamps',
    name: 'The Years of the Lamps',
    span: 'the Spring of Arda',
    note: 'Two Lamps light the world, until Melkor casts them down.',
    events: [
      {
        year: 'the Descent',
        title: 'The Valar enter Arda',
        body: 'The Ainur who love the World go down into it as the Valar and the Maiar, and labour to shape Arda amid the marring of Melkor.',
      },
      {
        year: 'the Two Lamps',
        title: 'Illuin and Ormal',
        body: 'Aulë forges two great Lamps — Illuin in the north, Ormal in the south — and their light floods the world and awakens its growth.',
      },
      {
        year: 'the Spring of Arda',
        title: 'The isle of Almaren',
        body: 'On an isle in a great lake the Valar make their first dwelling, and green things spread across the lands in the Spring of Arda.',
      },
      {
        year: 'the Fall of the Lamps',
        title: 'Melkor throws them down',
        body: 'From his fortress of Utumno Melkor casts down the Lamps. Their ruin breaks the shape of the world and ends the Spring, and the Valar withdraw into the West.',
      },
    ],
  },
  {
    id: 'trees',
    name: 'The Years of the Trees',
    span: 'the Elder Days',
    note: 'Valinor lit by Two Trees, before Sun or Moon.',
    events: [
      {
        year: 'the Bliss of Valinor',
        title: 'The Two Trees are kindled',
        body: 'Yavanna sings up Telperion and Laurelin, silver and gold, whose mingling light measures the ages of the Blessed Realm.',
      },
      {
        year: 'the Awakening',
        title: 'The Elves awake at Cuiviénen',
        body: 'By the waters under starlight the Firstborn open their eyes, and name themselves the Quendi, those that speak.',
      },
      {
        year: 'the Noontide',
        title: 'The Silmarils are made',
        body: 'Fëanor captures the light of the Trees in three jewels — the fairest works of the Eldar, and the seed of much sorrow.',
      },
      {
        year: 'the Darkening',
        title: 'The Trees are slain',
        body: 'Melkor and Ungoliant poison the Trees and steal the Silmarils. Fëanor swears his Oath and leads the Noldor back to Middle-earth.',
      },
    ],
  },
  {
    id: 'first',
    name: 'The First Age',
    span: 'c. 590 years',
    note: 'The long wars of Beleriand against Morgoth.',
    events: [
      {
        year: 'F.A. 1',
        title: 'The Sun first rises',
        body: 'The last fruit of Laurelin is set in the sky as the Moon and Sun. With the first dawn, Men awake in the east.',
      },
      {
        year: 'F.A. 465',
        title: 'Beren and Lúthien',
        body: 'A mortal man and an Elf-maid cut a Silmaril from Morgoth’s iron crown — the one jewel ever recovered, won by love.',
      },
      {
        year: 'F.A. 472',
        title: 'The Nírnaeth Arnoediad',
        body: 'The Battle of Unnumbered Tears breaks the free peoples. Morgoth’s dominion over the North is all but complete.',
      },
      {
        year: 'F.A. 510',
        title: 'The Fall of Gondolin',
        body: 'The hidden city, greatest of the Elven realms, is betrayed and burned. From its ruin flees Eärendil, still a child.',
      },
      {
        year: 'F.A. 590',
        title: 'The War of Wrath',
        body: 'The Host of Valinor casts Morgoth into the Void. Beleriand is drowned, and the First Age ends beneath the sea.',
      },
    ],
  },
  {
    id: 'second',
    name: 'The Second Age',
    span: '3,441 years',
    note: 'The rise of Númenor and the forging of the Rings.',
    events: [
      {
        year: 'S.A. 32',
        title: 'Númenor is founded',
        body: 'The Valar raise a star-shaped isle for the Edain, gifted long life. Elros, brother of Elrond, is its first king.',
      },
      {
        year: 'c. S.A. 1600',
        title: 'The One Ring is forged',
        body: 'In secret at Orodruin, Sauron pours his will into a Master Ring to rule the others — and the Elves perceive him at last.',
      },
      {
        year: 'S.A. 3319',
        title: 'The Downfall of Númenor',
        body: 'Beguiled by Sauron, the Númenóreans assail Valinor. The world is made round, the isle drowned; Elendil’s ships escape west.',
      },
      {
        year: 'S.A. 3441',
        title: 'The Last Alliance',
        body: 'Gil-galad and Elendil overthrow Sauron; Isildur cuts the Ring from his hand and keeps it, and the Age ends.',
      },
    ],
  },
  {
    id: 'third',
    name: 'The Third Age',
    span: '3,021 years',
    note: 'The waning of the Elves and the War of the Ring.',
    events: [
      {
        year: 'T.A. 2',
        title: 'Isildur’s Bane',
        body: 'The One Ring betrays Isildur at the Gladden Fields and slips into the Anduin, lost for two and a half thousand years.',
      },
      {
        year: 'T.A. 2463',
        title: 'Sméagol takes the Ring',
        body: 'The Ring is found by the river-folk. It passes to Sméagol, who bears it into the dark under the mountains and becomes Gollum.',
      },
      {
        year: 'T.A. 2941',
        title: 'Bilbo finds the Ring',
        body: 'Lost in the goblin-tunnels, a hobbit pockets a plain gold ring — and the long-hidden Bane of Isildur comes back into the light.',
      },
      {
        year: 'T.A. 3019',
        title: 'The Ring is unmade',
        body: 'On the 25th of March the Ring goes into the Fire of Orodruin. Sauron is undone, and the Third Age draws to its close.',
      },
    ],
  },
  {
    id: 'fourth',
    name: 'The Fourth Age',
    span: 'the Dominion of Men',
    note: 'The Elves depart; the world is given to Men.',
    events: [
      {
        year: 'F.A. 1',
        title: 'The King returns',
        body: 'Aragorn is crowned Elessar and weds Arwen. The realms of Gondor and Arnor are joined and renewed.',
      },
      {
        year: 'F.A. 1',
        title: 'The Ring-bearers depart',
        body: 'From the Grey Havens Elrond, Galadriel, Gandalf and Frodo sail into the West, and the Three Rings pass out of Middle-earth.',
      },
      {
        year: 'the years after',
        title: 'The world grows older',
        body: 'The Eldar dwindle and fade or take ship, and the deeds of the Elder Days pass into song, and then into legend, and then are forgotten.',
      },
    ],
  },
];
