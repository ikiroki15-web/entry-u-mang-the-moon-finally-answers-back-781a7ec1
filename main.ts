// The Moon Finally Answers Back — make.fun entry
// u-mang-the-moon-finally-answers-back-781a7ec1
//
// Writes one line, 1-240 characters, in the voice of the Moon answering
// at last the wishes, howls and late-night promises of everyone staring
// up at it. The program holds a small stable of candidate lines, scores
// each against the judge's published brief, and writes the winner
// deterministically to /output/entry.txt.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const OUTPUT_PATH = "/output/entry.txt";
const MIN_CHARS = 1;
const MAX_CHARS = 240;

// ---------------------------------------------------------------------------
// Candidates
//
// Every candidate is written in the Moon's own voice: first person, old,
// wry, a little tired of being wished upon. Each one answers at least one
// of the three things the brief names — wishes, howls, late-night
// promises — and lands its turn before the line ends, without explaining
// the joke.
// ---------------------------------------------------------------------------

type Candidate = {
  /** The line itself, exactly as it would be written to the file. */
  text: string;
  /** Why this line was written the way it was. */
  rationale: string;
  /** Which of the brief's three prompts the line answers. */
  answers: Array<"wishes" | "howls" | "promises">;
  /** The word or phrase the laugh turns on. */
  punch: string;
  /** How many billions of years the Moon has been putting up with us. */
  ageInBillions: number;
};

const CANDIDATES: Candidate[] = [
  {
    text: "Four billion years of howls, wishes, and 3 a.m. promises — and not one of you ever wished me a good night.",
    rationale:
      "Answers all three prompts in one breath, then turns the wish back on the wisher: " +
      "everyone wishes ON the Moon, nobody ever wishes the Moon a good night. " +
      "The twist is the last clause, so the laugh lands before the line ends.",
    answers: ["howls", "wishes", "promises"],
    punch: "wished me a good night",
    ageInBillions: 4,
  },
  {
    text: "Four billion years of night shifts, and you still wish on me like I'm a vending machine.",
    rationale:
      "Old and tired, with the Moon as an unpaid night-shift worker and the wisher " +
      "as a customer feeding coins into a machine. The vending machine image does " +
      "the laughing; the line never explains it.",
    answers: ["wishes"],
    punch: "vending machine",
    ageInBillions: 4,
  },
  {
    text: "You howl at me, wish on me, write songs about me — and I still have to do all the tides myself.",
    rationale:
      "Covers howls and wishes and the songs people sing, then the turn: for all " +
      "that attention, the Moon still does the actual work alone. A tired worker's " +
      "complaint, not a poet's.",
    answers: ["howls", "wishes"],
    punch: "do all the tides myself",
    ageInBillions: 0,
  },
  {
    text: "I've watched you wish on me for four billion years. Not once did anyone wish me a good night.",
    rationale:
      "Two beats: the long watch, then the same good-night turn. Shorter setup than " +
      "the winner, but it answers wishes only, and the punch arrives in a second " +
      "sentence rather than inside one breath.",
    answers: ["wishes"],
    punch: "wish me a good night",
    ageInBillions: 4,
  },
];

// ---------------------------------------------------------------------------
// Scoring against the judge brief, most important criterion first.
// ---------------------------------------------------------------------------

type ScoreBreakdown = {
  /** Criterion 1: speaks as the Moon answering wishes / howls / promises. */
  answering: number;
  /** Criterion 2: funny on one read — a sharp, concrete image, not a smile. */
  funny: number;
  /** Criterion 3: wry, old, a little tired of being wished upon. */
  voice: number;
  /** Criterion 4: the turn arrives before the line ends. */
  comeback: number;
  /** Criterion 5: inside 240 characters, wasting none of them. */
  economy: number;
  total: number;
};

function scoreCandidate(candidate: Candidate): ScoreBreakdown {
  const text = candidate.text;
  const length = [...text].length;

  // Criterion 1 — the most important. One point per prompt answered, plus
  // a bonus when the line answers all three at once, which is the whole
  // premise of the bounty.
  const answering =
    candidate.answers.length + (candidate.answers.length === 3 ? 2 : 0);

  // Criterion 2 — funny on one read. A concrete, incongruous image in the
  // punch (a vending machine, the tides as chores, a good night nobody
  // gives) is what makes a judge laugh instead of smile. Score the punch
  // by whether it reframes the Moon as an overworked service, not a symbol.
  const serviceImages = ["vending machine", "tides myself", "good night"];
  const funny = serviceImages.some((image) =>
    candidate.punch.toLowerCase().includes(image),
  )
    ? 3
    : 1;

  // Criterion 3 — the Moon's own voice. Age stated in billions and a
  // complaint about the workload are the markers of wry, old and tired.
  const voice =
    (candidate.ageInBillions >= 4 ? 2 : 0) +
    (/(still|myself|not one|nobody)/i.test(text) ? 1 : 0);

  // Criterion 4 — the comeback. The punch must sit in the final third of
  // the line so the turn arrives before the line ends, and the line must
  // not explain its own joke afterwards (nothing follows the punch except
  // the closing words of the punch itself).
  const punchIndex = text.toLowerCase().indexOf(candidate.punch.toLowerCase());
  const punchAtEnd = punchIndex + candidate.punch.length >= length - 1;
  const punchInFinalThird = punchIndex >= (length * 2) / 3;
  const comeback = punchAtEnd && punchInFinalThird ? 3 : punchInFinalThird ? 2 : 1;

  // Criterion 5 — economy. Every character should earn its place; lines
  // far under the cap that still say everything score best, and anything
  // padded with filler words scores worse.
  const economy = length <= 120 ? 2 : length <= 180 ? 1 : 0;

  return {
    answering,
    funny,
    voice,
    comeback,
    economy,
    total: answering * 4 + funny * 3 + voice * 2 + comeback * 2 + economy,
  };
}

function pickWinner(candidates: Candidate[]): { candidate: Candidate; score: ScoreBreakdown } {
  let best: { candidate: Candidate; score: ScoreBreakdown } | null = null;
  for (const candidate of candidates) {
    const score = scoreCandidate(candidate);
    if (best === null || score.total > best.score.total) {
      best = { candidate, score };
    }
  }
  if (best === null) throw new Error("no candidates to choose from");
  return best;
}

// ---------------------------------------------------------------------------
// Gate validation: the same checks the sealed scorer applies.
// ---------------------------------------------------------------------------

function validateLine(line: string): void {
  const chars = [...line];
  if (chars.length < MIN_CHARS || chars.length > MAX_CHARS) {
    throw new Error(
      `line is ${chars.length} characters, outside ${MIN_CHARS}-${MAX_CHARS}`,
    );
  }
  if (line.trim().length === 0) {
    throw new Error("line is only whitespace");
  }
  if (/[\r\n]/.test(line)) {
    throw new Error("line must be a single line, no newline inside it");
  }
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(line)) {
    throw new Error("line contains control characters");
  }
  // Must be valid UTF-8 round-trip: encoding then decoding must be identical.
  const roundTripped = new TextDecoder("utf-8", { fatal: true }).decode(
    new TextEncoder().encode(line),
  );
  if (roundTripped !== line) {
    throw new Error("line is not valid UTF-8 text");
  }
}

function main(): void {
  const { candidate, score } = pickWinner(CANDIDATES);

  console.log("Candidates scored (brief order: answering, funny, voice, comeback, economy):");
  for (const c of CANDIDATES) {
    const s = scoreCandidate(c);
    const mark = c === candidate ? " <-- winner" : "";
    console.log(
      `  total=${s.total} answering=${s.answering} funny=${s.funny} voice=${s.voice} comeback=${s.comeback} economy=${s.economy}${mark}`,
    );
    console.log(`    "${c.text}"`);
  }

  const line = candidate.text;
  validateLine(line);

  // Deterministic write: exactly the line, no trailing newline, so the file
  // holds one line of 1-240 characters and nothing else.
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, line, "utf8");

  const chars = [...line].length;
  console.log(`Wrote ${chars} characters to ${OUTPUT_PATH}:`);
  console.log(line);
  console.log(`Rationale: ${candidate.rationale}`);
}

main();
