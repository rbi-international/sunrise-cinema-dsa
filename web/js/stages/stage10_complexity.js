// Stage 10: the manager's question. Big-O, Omega, Theta, time-space tradeoff and the final cost table.

import { api } from "../api.js";
import { el, stageHeader, block, takeaway, limitation, field, textInput, button, table, count } from "../ui.js";
import { getCost } from "../costLog.js";
import { codeView } from "../codeView.js";

const COST_TABLE = [
  ["Access by index", "Go to seat 7", "O(1)", "O(1)", "O(1)", "access"],
  ["Traversal", "Count free seats", "Θ(n)", "Θ(n)", "O(1)", "traversal"],
  ["Insert at position", "VIP joins waitlist", "O(1) at end", "O(n) at front", "O(1)", "insert"],
  ["Delete at position", "Someone leaves", "O(1) at end", "O(n) at front", "O(1)", "delete"],
  ["Linear search", "Find a free seat", "O(1)", "O(n)", "O(1)", "linear"],
  ["Binary search (sorted)", "Find ticket 1047", "O(1)", "O(log n)", "O(1)", "binary"],
  ["Bubble sort (simple)", "Order ticket IDs", "O(n²)", "O(n²)", "O(1)", "bubble"],
  ["Selection sort", "Order ticket IDs", "O(n²)", "O(n²)", "O(1)", "selection"],
  ["Insertion sort", "Order ticket IDs", "O(n)", "O(n²)", "O(1)", "insertion"],
  ["Merge two sorted lists", "Online + counter", "O(m + n)", "O(m + n)", "O(m + n)", "merge"],
  ["2D traversal", "Count booked seats", "Θ(M × N)", "Θ(M × N)", "O(1)", "traversal2d"],
  ["String length", "Name length", "Θ(L)", "Θ(L)", "O(1)", "strlen"],
];

function growthChart(rows) {
  const width = 620;
  const height = 260;
  const left = 56;
  const bottom = 34;
  const top = 14;
  const right = 16;
  const maxY = Math.max(1, ...rows.map((row) => Math.max(row.linear, row.binary)));
  const groupWidth = (width - left - right) / rows.length;
  const barWidth = Math.min(46, groupWidth / 3);
  const y = (value) => top + (height - top - bottom) * (1 - value / maxY);
  const parts = [];
  for (let k = 0; k <= 4; k++) {
    const value = Math.round((maxY * k) / 4);
    parts.push(`<line x1="${left}" x2="${width - right}" y1="${y(value)}" y2="${y(value)}" stroke="#e5dfd0"/>`);
    parts.push(`<text x="${left - 8}" y="${y(value) + 4}" text-anchor="end">${value}</text>`);
  }
  rows.forEach((row, index) => {
    const x = left + groupWidth * index + groupWidth / 2;
    parts.push(`<rect x="${x - barWidth - 2}" y="${y(row.linear)}" width="${barWidth}" height="${y(0) - y(row.linear)}" rx="4" fill="#9b2c3b"/>`);
    parts.push(`<rect x="${x + 2}" y="${y(row.binary)}" width="${barWidth}" height="${Math.max(2, y(0) - y(row.binary))}" rx="4" fill="#1f6b46"/>`);
    parts.push(`<text x="${x - barWidth / 2 - 2}" y="${y(row.linear) - 5}" text-anchor="middle">${row.linear}</text>`);
    parts.push(`<text x="${x + barWidth / 2 + 2}" y="${y(row.binary) - 5}" text-anchor="middle">${row.binary}</text>`);
    parts.push(`<text x="${x}" y="${height - 12}" text-anchor="middle">n = ${row.n}</text>`);
  });
  const svg = `<svg class="chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Worst-case checks: linear vs binary search">${parts.join("")}</svg>`;
  return el("div", { html: svg + '<div class="legend"><span style="--swatch:#9b2c3b">linear search checks</span><span style="--swatch:#1f6b46">binary search checks</span></div>' });
}

export default {
  number: 10,
  title: "The manager's question",
  subtitle: "On Diwali there will be 1000 tickets, not 8. What slows down?",
  topic: "Big-O · Omega · Theta · time-space tradeoff",
  story: "Two ushers search a register for the last ticket. Usher A reads every entry; Usher B opens the middle and halves the register each time. With 10 entries the difference is small. With 1000, A reads 1000 entries and B looks at 10.",

  mount(container) {
    const sizesInput = textInput("10,100,1000", { class: "wide" });
    const growthArea = el("div");

    async function measure() {
      let result;
      try {
        result = await api.get("/api/complexity", { sizes: sizesInput.value });
      } catch (error) {
        growthArea.replaceChildren(el("p", { class: "result-line bad" }, error.message));
        return;
      }
      growthArea.replaceChildren(
        growthChart(result.rows),
        table(["n", "Linear checks (worst)", "Binary checks (worst)", "floor(log2 n) + 1"],
          result.rows.map((row) => [String(row.n), String(row.linear), String(row.binary), String(row.maxBinary)]), { numeric: [0, 1, 2, 3] }),
        result.rows.length >= 2
          ? el("p", { class: "real-terms" },
              `Size grew ${Math.round(result.rows[result.rows.length - 1].n / result.rows[0].n)} times. Linear work grew from ${result.rows[0].linear} to ${result.rows[result.rows.length - 1].linear}; binary work grew from ${result.rows[0].binary} to ${result.rows[result.rows.length - 1].binary}.`)
          : "",
      );
    }

    const costArea = el("div");
    function drawCostTable() {
      costArea.replaceChildren(table(
        ["Operation", "Cinema job", "Best case", "Worst case", "Extra space", "Measured today"],
        COST_TABLE.map(([operation, job, best, worst, space, key]) => {
          const measured = getCost(key);
          return [operation, job, best, worst, space, measured ? `${count(measured.checks, "check")}, ${count(measured.moves, "move")} (n = ${measured.n})` : "not run yet"];
        }),
      ));
    }
    const onCost = () => drawCostTable();
    window.addEventListener("cost-recorded", onCost);

    drawCostTable();
    measure();

    container.append(
      stageHeader(this),
      block("Measure the growth",
        el("div", { class: "controls" }, field("list sizes (up to 1000)", sizesInput), button("Measure", measure)),
        growthArea,
      ),
      block("In real terms",
        el("p", { class: "real-terms" }, "Complexity describes how the number of steps grows with input size n, ignoring constants and machine speed."),
        table(["Notation", "Meaning", "Used for"], [
          ["Big-O, O(g(n))", "upper bound: never more than about c × g(n) steps for large n", "worst case"],
          ["Omega, Ω(g(n))", "lower bound: always at least about c × g(n) steps", "best case"],
          ["Theta, Θ(g(n))", "tight bound: both of the above", "best and worst grow the same way"],
        ]),
        el("div", { class: "formula" }, "f(n) = O(g(n))  ⇔  there exist c > 0 and n0 > 0 such that 0 ≤ f(n) ≤ c · g(n) for all n ≥ n0\nf(n) = Ω(g(n))  ⇔  f(n) ≥ c · g(n) for all n ≥ n0\nf(n) = Θ(g(n))  ⇔  both hold"),
        takeaway("What matters is how work grows, not the time on one day.", "Size ×100 means linear work ×100 but binary work only +6 checks."),
        limitation("Big-O hides constants. For tiny lists a \"slow\" algorithm can be faster in practice; the notation is about large n."),
      ),
      block("Time-space tradeoff",
        el("p", { class: "real-terms" },
          "Counting free seats by scanning costs O(n) time and no extra memory. Keep one extra int ", el("strong", {}, "freeCount"),
          ", subtract 1 on every booking and add 1 on every cancellation, and \"how many seats are free?\" becomes O(1). Sorting once so every later search is O(log n) is the same trade at a larger scale."),
        limitation("The extra variable must be updated on every booking and cancellation. Forget one place and it silently disagrees with the real row."),
      ),
      block("The final cost table",
        el("p", { class: "real-terms" }, "The last column fills in from what you ran on the earlier stages in this browser."),
        costArea,
        el("p", { class: "story", style: { fontSize: "22px" } },
          "Cliffhanger: our waitlist is slow because every VIP makes everyone shift. What if each person only remembered who stands behind them? That is the linked list, and it opens Unit II."),
      ),
      codeView("complexity"),
    );

    return () => window.removeEventListener("cost-recorded", onCost);
  },
};
