// Stage 5: put ticket IDs in order. Bubble, selection and insertion sort, with real comparison counts.

import { api, EVENT } from "../api.js";
import { el, stageHeader, block, takeaway, limitation, field, numberInput, textInput, button, toast, table } from "../ui.js";
import { Player } from "../player.js";
import { codeView } from "../codeView.js";
import { framesForArray } from "../traceFrames.js";
import { recordCost } from "../costLog.js";

const PICTURES = {
  bubble: "Walk along the line comparing neighbours. If the taller one is in front, swap. After one walk the tallest is at the end.",
  selection: "Look over everyone, pick the shortest, bring them to the front. Then the shortest of the rest to position 2. Repeat.",
  insertion: "Like arranging playing cards: pick up the next card and slide it left past every bigger card until it fits.",
};

function bars(values, marks) {
  const low = Math.min(...values);
  const high = Math.max(...values);
  const span = Math.max(1, high - low);
  return el("div", { class: "bars" }, values.map((value, index) =>
    el("div", { class: "bar-cell" },
      el("div", { class: "bar-value" }, value),
      el("div", { class: `bar ${marks[index] || ""}`, style: { height: `${30 + ((value - low) / span) * 110}px` } }),
      el("div", { class: "index" }, `[${index}]`),
    ),
  ));
}

export default {
  number: 5,
  title: "Sort the tickets",
  subtitle: "Three ways to put ticket IDs in order, and what each one costs",
  topic: "Bubble sort · selection sort · insertion sort",
  story: "The manager wants tonight's ticket IDs in order so the gate staff can check them quickly. We sort the same list three ways and count the work.",

  mount(container, context) {
    const barArea = el("div");
    const pictureLine = el("p", { class: "story", style: { fontSize: "21px" } }, "Pick a sort to watch it run.");
    const resultArea = el("div");
    const player = new Player((frame) => {
      barArea.replaceChildren(bars(frame.values, frame.marks));
    });

    function showList() {
      player.load([{ values: context.state.bookings.slice(), marks: {}, caption: "Booking order. Press a sort button.", checks: 0, moves: 0 }], false);
    }

    async function runSort(algorithm) {
      const result = await context.run(() => api.post("/api/sort", { algorithm }));
      if (!result) {
        return;
      }
      pictureLine.textContent = PICTURES[algorithm];
      recordCost(algorithm, result.before.length, result.checks, result.moves);
      const frames = framesForArray(result.before, result.trace, (event, before, after) => {
        const [type, a, b] = event;
        if (type === EVENT.COMPARE) {
          if (algorithm === "selection") {
            return `Is ${before[a]} smaller than the smallest so far (${before[b]})?`;
          }
          return `Compare ${before[a]} and ${before[b]}: ${before[a] > before[b] ? "wrong order" : "fine"}.`;
        }
        if (type === EVENT.SWAP) {
          return `Swap: ${after[a]} and ${after[b]} change places.`;
        }
        if (type === EVENT.MOVE) {
          return `${after[b]} is bigger than the card, so it shifts right to [${b}].`;
        }
        if (type === EVENT.SET) {
          return `Drop the card ${b} into the gap at [${a}].`;
        }
        return "";
      }, {
        startCaption: `${algorithm} sort on ${result.before.length} tickets.`,
        endCaption: result.ok
          ? `Sorted with ${result.checks} comparisons and ${result.moves} ${algorithm === "insertion" ? "shifts and drops" : "swaps"}.`
          : `Not sorted: ${result.checks} comparisons, ${result.moves} moves. Check the loops in ${algorithm}Sort.`,
        endMarks: (values) => (result.ok ? Object.fromEntries(values.map((_, index) => [index, "done"])) : {}),
      });
      player.load(frames);
      const n = result.before.length;
      resultArea.replaceChildren(el("p", { class: "real-terms" },
        `n = ${n}, so n(n − 1)/2 = ${(n * (n - 1)) / 2}. ${algorithm} sort made ${result.checks} comparisons on this list.`));
      toast(result.message, !result.ok);
    }

    async function shuffle() {
      const result = await context.run(() => api.post("/api/bookings/shuffle"));
      if (result) {
        showList();
      }
    }

    const listInput = textInput("1047,1003,1029,1011,1052,1018,1036,1008", { class: "wide" });
    async function setList() {
      const result = await context.run(() => api.post("/api/bookings/set", { values: listInput.value }));
      if (result) {
        toast("Bookings replaced");
        showList();
      }
    }

    // best / random / worst case table
    const sizeInput = numberInput(50, { min: "2", max: "300" });
    const compareArea = el("div");
    async function compareSorts() {
      const result = await context.run(() => api.get("/api/sort/compare", { n: Number(sizeInput.value) }));
      if (!result) {
        return;
      }
      const rows = ["sorted", "random", "reversed"].map((order) => {
        const cells = [order === "sorted" ? "already sorted (best)" : order === "reversed" ? "reverse sorted (worst)" : "random"];
        ["bubble", "selection", "insertion"].forEach((algorithm) => {
          const row = result.rows.find((item) => item.order === order && item.algorithm === algorithm);
          cells.push(`${row.checks} / ${row.moves}${row.sortedOk ? "" : " ✗"}`);
        });
        return cells;
      });
      compareArea.replaceChildren(
        table(["Input order (n = " + result.n + ")", "Bubble", "Selection", "Insertion"], rows, { numeric: [1, 2, 3] }),
        el("p", { class: "real-terms" }, "Each cell is comparisons / moves. Notice insertion sort on already-sorted data: n − 1 comparisons. That is its O(n) best case."),
      );
    }

    showList();

    container.append(
      stageHeader(this),
      block("Ticket IDs as bars",
        pictureLine,
        barArea,
        el("div", { class: "controls" },
          button("Bubble sort", () => runSort("bubble")),
          button("Selection sort", () => runSort("selection")),
          button("Insertion sort", () => runSort("insertion")),
          button("Shuffle", shuffle, "ghost"),
        ),
        player.node,
        resultArea,
        el("div", { class: "controls" },
          field("your own list (2 to 16 numbers)", listInput),
          button("Use this list", setList, "soft"),
        ),
      ),
      block("In real terms",
        table(["Sort", "Best case", "Worst case", "Swaps or shifts", "Stable"], [
          ["Bubble (simple form)", "O(n²)", "O(n²)", "many swaps", "yes"],
          ["Bubble with a no-swap stop flag", "O(n)", "O(n²)", "many swaps", "yes"],
          ["Selection", "O(n²)", "O(n²)", "at most n − 1 swaps", "no"],
          ["Insertion", "O(n), already sorted", "O(n²), reverse sorted", "shifts, not swaps", "yes"],
        ]),
        takeaway("All three simple sorts are O(n²) in the worst case.", "They differ in best case and in how much they move data."),
        limitation("Same answer from all three does not mean same cost. Compare the counts below before choosing."),
      ),
      block("Best, random and worst case, measured",
        el("div", { class: "controls" }, field("n", sizeInput), button("Run all three sorts", compareSorts, "soft")),
        compareArea,
      ),
      codeView("sorting"),
    );
  },
};
