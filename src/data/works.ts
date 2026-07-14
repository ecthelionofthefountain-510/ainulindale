/**
 * J.R.R. Tolkien's legendarium and related works, grouped so you can "tick off"
 * what you've read. This is a starting set — easy to extend over time.
 */

export type WorkCategory = 'lifetime' | 'posthumous' | 'home';

export interface Work {
  id: string;
  title: string;
  year?: number;
  category: WorkCategory;
}

export interface CategoryMeta {
  key: WorkCategory;
  label: string;
  blurb: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    key: 'lifetime',
    label: 'Published in his lifetime',
    blurb: 'The works Tolkien saw into print himself.',
  },
  {
    key: 'posthumous',
    label: 'Published posthumously',
    blurb: 'Edited and released after 1973, mostly by Christopher Tolkien.',
  },
  {
    key: 'home',
    label: 'The History of Middle-earth',
    blurb: 'The twelve-volume study of the legendarium’s evolution.',
  },
];

export const WORKS: Work[] = [
  // Published in his lifetime
  { id: 'hobbit', title: 'The Hobbit', year: 1937, category: 'lifetime' },
  { id: 'leaf-niggle', title: 'Leaf by Niggle', year: 1945, category: 'lifetime' },
  { id: 'farmer-giles', title: 'Farmer Giles of Ham', year: 1949, category: 'lifetime' },
  { id: 'fellowship', title: 'The Fellowship of the Ring', year: 1954, category: 'lifetime' },
  { id: 'two-towers', title: 'The Two Towers', year: 1954, category: 'lifetime' },
  { id: 'return-king', title: 'The Return of the King', year: 1955, category: 'lifetime' },
  { id: 'tom-bombadil', title: 'The Adventures of Tom Bombadil', year: 1962, category: 'lifetime' },
  { id: 'tree-leaf', title: 'Tree and Leaf', year: 1964, category: 'lifetime' },
  { id: 'road-goes-on', title: 'The Road Goes Ever On', year: 1967, category: 'lifetime' },
  { id: 'smith-wootton', title: 'Smith of Wootton Major', year: 1967, category: 'lifetime' },

  // Published posthumously
  { id: 'silmarillion', title: 'The Silmarillion', year: 1977, category: 'posthumous' },
  { id: 'unfinished-tales', title: 'Unfinished Tales', year: 1980, category: 'posthumous' },
  { id: 'letters', title: 'The Letters of J.R.R. Tolkien', year: 1981, category: 'posthumous' },
  { id: 'children-hurin', title: 'The Children of Húrin', year: 2007, category: 'posthumous' },
  { id: 'beren-luthien', title: 'Beren and Lúthien', year: 2017, category: 'posthumous' },
  { id: 'fall-gondolin', title: 'The Fall of Gondolin', year: 2018, category: 'posthumous' },
  { id: 'fall-numenor', title: 'The Fall of Númenor', year: 2022, category: 'posthumous' },

  // The History of Middle-earth
  { id: 'home-1', title: 'I. The Book of Lost Tales, Part One', year: 1983, category: 'home' },
  { id: 'home-2', title: 'II. The Book of Lost Tales, Part Two', year: 1984, category: 'home' },
  { id: 'home-3', title: 'III. The Lays of Beleriand', year: 1985, category: 'home' },
  { id: 'home-4', title: 'IV. The Shaping of Middle-earth', year: 1986, category: 'home' },
  { id: 'home-5', title: 'V. The Lost Road and Other Writings', year: 1987, category: 'home' },
  { id: 'home-6', title: 'VI. The Return of the Shadow', year: 1988, category: 'home' },
  { id: 'home-7', title: 'VII. The Treason of Isengard', year: 1989, category: 'home' },
  { id: 'home-8', title: 'VIII. The War of the Ring', year: 1990, category: 'home' },
  { id: 'home-9', title: 'IX. Sauron Defeated', year: 1992, category: 'home' },
  { id: 'home-10', title: 'X. Morgoth’s Ring', year: 1993, category: 'home' },
  { id: 'home-11', title: 'XI. The War of the Jewels', year: 1994, category: 'home' },
  { id: 'home-12', title: 'XII. The Peoples of Middle-earth', year: 1996, category: 'home' },
];

export const TOTAL_WORKS = WORKS.length;
