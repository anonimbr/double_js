const crypto = require("crypto");

function gameResultFromHash(hash) {
  const result = gameNumberFromHash(hash, 0, 14);
  if (result === 0) {
    return "green (0)";
  }

  return (result % 2 === 0 ? "black" : "red") + " (" + result + ")";
}

function gameNumberFromHash(hash, min, max) {
  const maxHashInt = 4503599627370495; // 0xFFFFFFFFFFFFF
  const hashInt = parseInt(hash.substr(0, 13), 16);
  const number =
    min + Math.floor((max - min + 1) * (hashInt / (maxHashInt + 1)));

  return number;
}

function saltHash(hash) {
  return crypto.createHmac("sha256", "DOUBLE:0").update(hash).digest("hex");
}

// - - - - -

const resultEl = document.getElementById("result");
const gameHashEl = document.getElementById("game_hash");
const serverSeedInput = document.getElementById("server_seed_input");
const debugEl = document.getElementById("debug");

serverSeedInput.addEventListener("input", calculateResult);

function calculateResult() {
  debugEl.innerHTML = "";
  const seed = serverSeedInput.value.trim();
  if (seed.length === 0) {
    resultEl.innerHTML = gameHashEl.innerHTML = "";
    return;
  }

  gameHashEl.innerHTML = crypto.createHash("sha256").update(seed).digest("hex");
  resultEl.innerHTML = gameResultFromHash(saltHash(seed));
}
