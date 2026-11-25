// The Moon Finally Answers Back — entry program.
//
// The Moon picks one comeback line: the line that best matches the judge
// brief, scored against the brief's criteria in order of importance:
//   1. speaks as the Moon answering the wishes, howls and late-night
//      promises of everyone staring up at it
//   2. funny on one read, a real laugh rather than a polite smile
//   3. sounds like the Moon's own voice — wry, old, a little tired of
//      being wished upon
//   4. lands as a comeback in one read, the turn arriving before the
//      line ends
//   5. stays inside 240 characters and wastes none of them
//
// The winner is written deterministically to /output/entry.txt:
// a single line, no trailing newline.

import { mkdirSync, writeFileSync } from "node:fs";

type Candidate = {
  text: string;
  // Scores out of 10 per judge criterion, in the brief's order.
  moonVoice: number; // speaks as the Moon answering the crowd below
  funny: number; // funny on one read
  wryOldVoice: number; // wry, old, tired of being wished upon
  comeback: number; // lands as a comeback in one read
};

const CANDIDATES: Candidate[] = [
  {
    text: "Four billion years of howls, wishes, and 3 a.m. promises — and not one of you ever wished me a good night.",
    moonVoice: 10,
    funny: 9,
    wryOldVoice: 10,
    comeback: 10,
  },
  {
    text: "I have heard every wish you ever made. Most of them were about someone else's parking spot.",
    moonVoice: 8,
    funny: 7,
    wryOldVoice: 8,
    comeback: 7,
  },
  {
    text: "You howl at me, you wish on me, you promise me the moon — I AM the moon, and I am very tired.",
    moonVoice: 9,
    funny: 6,
    wryOldVoice: 8,
    comeback: 6,
  },
  {
    text: "Four billion years old and you still think I grant wishes. I am a rock. A very pretty rock.",
    moonVoice: 8,
    funny: 7,
    wryOldVoice: 9,
    comeback: 6,
  },
  {
    text: "Every night you stare up and whisper your dreams to me. I have kept all of them. I have read none of them.",
    moonVoice: 8,
    funny: 6,
    wryOldVoice: 7,
    comeback: 5,
  },
];

// Weights follow the brief's order: the Moon answering the crowd matters
// most, then the laugh, then the voice, then the turn.
const WEIGHTS = { moonVoice: 4, funny: 3, wryOldVoice: 2, comeback: 1 };

// Criterion 5 of the brief: a line should stay inside 240 characters and
// waste none of them. A comeback lands best in one breath, so lines in the
// 80-140 character band earn the full length bonus and shorter or longer
// ones earn proportionally less. The winner sits at 106 characters.
function lengthBonus(text: string): number {
  const len = text.length;
  if (len >= 80 && len <= 140) return 10;
  if (len < 80) return Math.max(0, (len / 80) * 10);
  return Math.max(0, 10 - (len - 140) / 10);
}

function score(c: Candidate): number {
  return (
    c.moonVoice * WEIGHTS.moonVoice +
    c.funny * WEIGHTS.funny +
    c.wryOldVoice * WEIGHTS.wryOldVoice +
    c.comeback * WEIGHTS.comeback +
    lengthBonus(c.text)
  );
}

function isValidLine(text: string): boolean {
  return (
    text.length >= 1 &&
    text.length <= 240 &&
    !text.includes("\n") &&
    text.trim().length > 0
  );
}

const scored = CANDIDATES.map((c, index) => ({ c, index, total: score(c) }));

// Highest total wins; ties break toward the earlier candidate, so the
// choice is fully deterministic.
scored.sort((a, b) => b.total - a.total || a.index - b.index);

const winner = scored[0].c;

if (!isValidLine(winner.text)) {
  throw new Error("winning line fails the 1-240 character single-line gate");
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", winner.text, "utf8");
