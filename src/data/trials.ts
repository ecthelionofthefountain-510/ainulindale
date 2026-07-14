/**
 * Trials of Mordor — the quiz bank. Each question has four answers and the index
 * of the true one. A starting set of lore trials, easy to grow (and later to
 * tier by difficulty as the "descent" deepens).
 */

export interface Trial {
  id: string;
  question: string;
  options: [string, string, string, string];
  answer: number;
}

export const TRIALS: Trial[] = [
  {
    id: 'three-rings',
    question: 'Who forged the Three Elven Rings in secret?',
    options: ['Fëanor', 'Celebrimbor', 'Sauron', 'Aulë'],
    answer: 1,
  },
  {
    id: 'first-dark-lord',
    question: 'Who was the first Dark Lord, master to Sauron?',
    options: ['Saruman', 'Morgoth', 'Glaurung', 'Angmar'],
    answer: 1,
  },
  {
    id: 'ring-unmade',
    question: 'In whose fires was the One Ring unmade?',
    options: ['Angband', 'Orodruin', 'Utumno', 'Thangorodrim'],
    answer: 1,
  },
  {
    id: 'aragorn-king',
    question: 'By what name did Aragorn rule as king?',
    options: ['Elendil', 'Elessar', 'Isildur', 'Eärnur'],
    answer: 1,
  },
  {
    id: 'shelob',
    question: 'What manner of creature was Shelob?',
    options: ['A dragon', 'A great spider', 'A Balrog', 'A werewolf'],
    answer: 1,
  },
  {
    id: 'ringbearer',
    question: 'Who bore the One Ring to Mount Doom?',
    options: ['Bilbo', 'Frodo', 'Boromir', 'Gollum'],
    answer: 1,
  },
];
