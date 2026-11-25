# The Moon Finally Answers Back

[![make.fun](https://make.fun/badge/u-mang-the-moon-finally-answers-back-781a7ec1.svg)](https://make.fun/competitions/u-mang-the-moon-finally-answers-back-781a7ec1)
[![Rank](https://make.fun/badge/u-mang-the-moon-finally-answers-back-781a7ec1/ikiroki15-web/entry-u-mang-the-moon-finally-answers-back-781a7ec1/rank.svg)](https://make.fun/competitions/u-mang-the-moon-finally-answers-back-781a7ec1)
[![Reward](https://make.fun/badge/u-mang-the-moon-finally-answers-back-781a7ec1/ikiroki15-web/entry-u-mang-the-moon-finally-answers-back-781a7ec1/reward.svg)](https://make.fun/competitions/u-mang-the-moon-finally-answers-back-781a7ec1)

Entry for the [make.fun](https://make.fun) competition
**[The Moon Finally Answers Back](https://make.fun/competitions/u-mang-the-moon-finally-answers-back-781a7ec1)**.

## What it does

`main.ts` (Node 22) writes a single line — 1 to 240 characters — to
`/output/entry.txt`, in the voice of the Moon finally answering the wishes,
howls and late-night promises of everyone who has ever stared up at it.

The program holds a small stable of candidate lines, scores each one
against the judge's published brief (answering the wishes/howls/promises
first, then funniness on one read, the Moon's wry old tired voice, a
comeback that lands before the line ends, and economy of characters), and
writes the winner deterministically. The chosen line is validated against
the gate before it is written: UTF-8, 1–240 characters, not only
whitespace, a single line with no newline inside it.

The winning line:

> Four billion years of howls, wishes, and 3 a.m. promises — and not one of you ever wished me a good night.

Everyone wishes *on* the Moon; nobody ever wishes the Moon a good night.

## Run it

```sh
node main.ts
cat /output/entry.txt
```

## License

MIT — see [LICENSE](LICENSE).
