---
title: Real or Kokoro?
emoji: 🎭
colorFrom: pink
colorTo: indigo
sdk: static
app_file: index.html
short_description: Train your ear on TTS expressiveness — 10 rounds
tags:
- tts
- game
- expressiveness
---

# Real or Kokoro? 🎭

**Honest label: every clip is Kokoro TTS.** There are no human recordings here — and that's the
point. Each round plays two takes of the same sentence: one directed to be **expressive**, one read
**flat**. You guess which is which. Ten rounds, immediate feedback, and a one-line forensic hint
(contrastive stress, pause placement, pitch contour, plosives, tempo maps).

Expressiveness is the axis TTS quality is actually judged on — and the axis voice agents win or
lose user trust on. This game trains your ear on it.

**▶ Try it live:** <https://iamdgarcia-real-or-kokoro.static.hf.space> · **Code on GitHub:** <https://github.com/iamdgarcia/real-or-kokoro>

## How it works

- 10 sentence pairs (questions, numbers, repairs, literary rhythm, song lyrics — chosen because each
  hides a different expressiveness cue)
- A/B randomized per round; progress dots; final score card with copy-share
- 100% client-side (vanilla JS); clips are pre-generated 24 kHz mono WAVs (~2 MB each set)

## Credits

Clips generated with [Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M) (Apache-2.0,
© hexgrad & contributors) via [kokoro-onnx](https://github.com/thewh1teagle/kokoro-onnx),
run locally with the `af_heart`/`am_michael` voice packs. This Space is a fan-made ear-training
game, not affiliated with hexgrad.

Built by [iamdgarcia](https://huggingface.co/iamdgarcia) — realtime voice agent engineering.
More instruments: [Voice Agents Playground](https://iamdgarcia-voice-agents-playground.static.hf.space) ·
[Word Timing Explorer](https://iamdgarcia-word-timing-explorer.static.hf.space) ·
[Latency Gap Simulator](https://iamdgarcia-latency-gap-simulator.static.hf.space) ·
writeups at [The Learning Curve](https://iamdgarcia.substack.com).
