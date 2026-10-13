// Real or Kokoro — 10 rounds, which take is the expressive one?
// Both takes are Kokoro TTS: r{n}_kokoro.wav (expressive direction) vs r{n}_flat.wav.
const ROUNDS = 10;

const state = { round: 0, score: 0, order: [], answers: [] };

const $ = (id) => document.getElementById(id);
const audio = $("audio");

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildOrder() {
  state.order = shuffle(Array.from({ length: ROUNDS }, (_, i) => i + 1));
}

function renderDots() {
  $("dots").innerHTML = Array.from({ length: ROUNDS }, (_, i) => {
    const a = state.answers[i];
    const cls = a === undefined ? "dot" : a ? "dot hit" : "dot miss";
    return `<span class="${cls}"></span>`;
  }).join("");
}

const HINTS = [
  "The expressive take leans on contrastive stress — it pushes one word forward and lets the rest fall back.",
  "Listen to the pauses: the expressive read breaks where meaning breaks, the flat one breaks where the punctuation was.",
  "Pitch contour: expressive speech moves in arcs; flat reads sit on a plateau and drop politely at the end.",
  "Plosives and emphasis: 'ON', 'third time' — the expressive take hits consonants harder on stressed words.",
  "Rate changes: the expressive read slows down for numbers and lists, then speeds up on the run-out.",
  "Hesitation is a cue: a drawn-out 'I...' with a falling tail is staging, not reading.",
  "Newsreader energy vs form-field energy: one take is telling you something, the other is confirming it.",
  "Repairs are acted: 'Two sugars. Sorry — one sugar.' The expressive take stages the mistake.",
  "Literary rhythm gets a tempo map when it's expressive — hear the periodicity in the delivery.",
  "Song lyrics are the tell: flat reads them like a phone number; expressive reads find a groove.",
];

function src(rid, which) {
  return `assets/${rid}_${which}.wav`;
}

function loadRound() {
  const i = state.round;
  if (i >= ROUNDS) return showFinal();
  const rid = state.order[i];
  // side randomized per round
  const expressiveIsA = Math.random() < 0.5;
  state.side = expressiveIsA ? "A" : "B";
  $("roundLabel").textContent = `Round ${i + 1} / ${ROUNDS}`;
  $("playA").dataset.src = src(rid, expressiveIsA ? "kokoro" : "flat");
  $("playB").dataset.src = src(rid, expressiveIsA ? "flat" : "kokoro");
  $("feedback").hidden = true;
  $("guessRow").style.visibility = "visible";
  $("hint").textContent = HINTS[rid - 1];
  renderDots();
  stopAudio();
}

function stopAudio() {
  audio.pause();
  audio.currentTime = 0;
  for (const id of ["playA", "playB"]) $(id).classList.remove("playing");
}

function play(which) {
  const btn = $(which === "A" ? "playA" : "playB");
  if (audio.src !== btn.dataset.src && !audio.src.endsWith(btn.dataset.src)) {
    audio.src = btn.dataset.src;
  }
  audio.currentTime = 0;
  audio.play();
  $("playA").classList.toggle("playing", which === "A");
  $("playB").classList.toggle("playing", which === "B");
}
audio.onended = stopAudio;

function guess(which) {
  const i = state.round;
  const correct = which === state.side;
  state.answers[i] = correct;
  if (correct) state.score++;
  $("verdict").textContent = correct
    ? ["Correct.", "Nailed it.", "Good ear.", "That's the one."][Math.floor(Math.random() * 4)]
    : "Not this time.";
  $("verdict").className = "verdict " + (correct ? "good" : "bad");
  $("hint").style.display = "block";
  $("guessRow").style.visibility = "hidden";
  $("feedback").hidden = false;
  $("next").textContent = i + 1 >= ROUNDS ? "See score →" : "Next round →";
  renderDots();
}

function showFinal() {
  $("game").hidden = true;
  $("final").hidden = false;
  $("scoreBig").textContent = `${state.score}/${ROUNDS}`;
  const msgs = {
    0: "The robot wins this round-robin. Replay with headphones — the cues are subtle.",
    1: "TTS expressiveness is genuinely hard to hear. That's the point of this game.",
    2: "You caught the obvious ones. The subtle takes are where ear training starts.",
    3: "Solid ear. You're hearing the tempo maps and the staged pauses now.",
    4: "Half and half — the flat reads are getting good, or the expressive ones subtle.",
    5: "Half and half — you're tracking prosody, not just volume.",
    6: "Good. You hear contrastive stress — that's the core cue.",
    7: "Strong ear. Pauses and pitch arcs gave them away.",
    8: "Excellent. You'd catch a flat IVR bot in one sentence.",
    9: "Nearly perfect. Voice-agent QA role available.",
    10: "Perfect. Either you listen for a living, or the flat reads need work (both true).",
  };
  $("scoreMsg").textContent = msgs[state.score];
  $("scoreDetail").textContent =
    "Every clip was Kokoro-82M: expressive direction vs flat read. Expressiveness is where TTS quality is judged — and where voice agents win or lose trust.";
  renderDots();
}

$("playA").onclick = () => play("A");
$("playB").onclick = () => play("B");
$("guessA").onclick = () => guess("A");
$("guessB").onclick = () => guess("B");
$("next").onclick = () => { state.round++; loadRound(); };
$("restart").onclick = () => {
  state.round = 0; state.score = 0; state.answers = [];
  $("final").hidden = true; $("game").hidden = false;
  buildOrder(); loadRound();
};
$("copyShare").onclick = async () => {
  const txt = `I scored ${state.score}/${ROUNDS} on Real or Kokoro? 🎭 — can you hear TTS expressiveness? https://iamdgarcia-real-or-kokoro.static.hf.space`;
  try { await navigator.clipboard.writeText(txt); $("copyShare").textContent = "Copied!"; }
  catch { $("copyShare").textContent = txt; }
  setTimeout(() => ($("copyShare").textContent = "Copy result"), 2000);
};

buildOrder();
loadRound();
