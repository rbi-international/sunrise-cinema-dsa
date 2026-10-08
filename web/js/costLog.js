// costLog.js
// Remembers the cost students actually measured in each stage, so Stage 10 can show
// "what we measured today" next to the textbook cost table. Stored only in this browser.

const KEY = "sunrise-cinema-cost-log";
let log = {};

try {
  log = JSON.parse(localStorage.getItem(KEY) || "{}") || {};
} catch (error) {
  log = {};
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(log));
  } catch (error) {
    // storage blocked (private window): keep the log in memory only
  }
}

export function recordCost(operation, n, checks, moves) {
  log[operation] = { n, checks, moves, when: Date.now() };
  save();
  window.dispatchEvent(new CustomEvent("cost-recorded", { detail: { operation } }));
}

export function getCost(operation) {
  return log[operation];
}

export function visitedStages() {
  try {
    return new Set(JSON.parse(localStorage.getItem(`${KEY}-visited`) || "[]"));
  } catch (error) {
    return new Set();
  }
}

export function markVisited(number) {
  const visited = visitedStages();
  visited.add(number);
  try {
    localStorage.setItem(`${KEY}-visited`, JSON.stringify([...visited]));
  } catch (error) {
    // ignore
  }
}

export function clearCosts() {
  log = {};
  save();
}
