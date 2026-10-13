// Self-check: 10 rounds; both wavs exist per round; total assets < 30MB.
const fs = require("fs");
const path = require("path");

let fail = 0;
const check = (ok, msg) => { console.log((ok ? "PASS" : "FAIL") + " " + msg); if (!ok) fail++; };

const assets = path.join(__dirname, "assets");
let total = 0;
for (let i = 1; i <= 10; i++) {
  for (const which of ["kokoro", "flat"]) {
    const f = path.join(assets, `r${i}_${which}.wav`);
    const ok = fs.existsSync(f);
    if (ok) total += fs.statSync(f).size;
    check(ok, `r${i}_${which}.wav exists`);
  }
}
check(total < 30 * 1024 * 1024, `total assets ${(total / 1e6).toFixed(1)}MB < 30MB`);

// index.html references all rounds' assets via pattern, app.js has 10-round loop
const app = fs.readFileSync(path.join(__dirname, "app.js"), "utf8");
const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
check(/ROUNDS = 10;/.test(app), "app.js declares 10 rounds");
check(app.includes("assets/${rid}_${which}.wav") || app.includes("`assets/${rid}_${which}.wav`"), "app.js builds asset paths by round");
check(html.includes("id=\"guessA\"") && html.includes("id=\"guessB\""), "index.html has A/B guess buttons");
check(html.includes("Copy result"), "index.html has copy-share");

console.log(fail === 0 ? "ALL CHECKS PASSED" : `${fail} CHECK(S) FAILED`);
process.exit(fail === 0 ? 0 : 1);
