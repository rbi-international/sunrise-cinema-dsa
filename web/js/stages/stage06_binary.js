// Stage 6: find a ticket fast. Binary search on the sorted list, against linear search on the same list.

import { api, EVENT } from "../api.js";
import { el, stageHeader, block, takeaway, limitation, flow, field, numberInput, button, arrayView, toast, table, count } from "../ui.js";
import { Player } from "../player.js";
import { codeView } from "../codeView.js";
import { recordCost } from "../costLog.js";

function binaryFrames(list, trace, key, result) {
  const frames = [{ values: list, marks: {}, pointers: {}, caption: `Search ${key}. The whole list is still possible.`, checks: 0, moves: 0 }];
  const rows = [];
  let checks = 0;
  trace.forEach(([type, a, b, c]) => {
    if (type === EVENT.RANGE) {
      checks += 1;
      const marks = {};
      list.forEach((_, index) => {
        if (index < a || index > b) {
          marks[index] = "dim";
        }
      });
      marks[c] = "compare";
      const pointers = { [a]: "low", [b]: a === b ? "low high" : "high" };
      pointers[c] = (pointers[c] ? pointers[c] + " " : "") + "mid";
      const value = list[c];
      let decision;
      if (value === key) {
        decision = "Found it.";
      } else if (value < key) {
        decision = `${value} < ${key}, so throw away the left half: low = ${c + 1}.`;
      } else {
        decision = `${value} > ${key}, so throw away the right half: high = ${c - 1}.`;
      }
      rows.push([checks, a, b, c, value, decision]);
      frames.push({ values: list, marks, pointers, caption: `Check ${checks}: mid = (${a} + ${b}) / 2 = ${c}. list[${c}] = ${value}. ${decision}`, checks, moves: 0 });
    } else if (type === EVENT.FOUND) {
      frames.push({ values: list, marks: { [a]: "found" }, pointers: { [a]: "found" }, caption: `${key} is at index ${a}.`, checks, moves: 0 });
    }
  });
  frames.push({
    values: list,
    marks: result.result >= 0 ? { [result.result]: "found" } : Object.fromEntries(list.map((_, i) => [i, "dim"])),
    pointers: {},
    caption: result.result >= 0 ? `Found after ${count(checks, "check")}.` : `low passed high after ${count(checks, "check")}: ${key} is not in the list.`,
    checks,
    moves: 0,
  });
  return { frames, rows };
}

export default {
  number: 6,
  title: "Find a ticket fast",
  subtitle: "Open the middle, throw away half, repeat",
  topic: "Binary search · O(log n)",
  story: "The number-guessing game: I am thinking of a number from 1 to 100. A smart player says 50, hears higher, says 75… Every guess throws away half of what is left.",

  mount(container, context) {
    const listArea = el("div");
    const traceArea = el("div");
    const compareArea = el("div");
    const player = new Player((frame) => {
      listArea.replaceChildren(arrayView(frame.values, { marks: frame.marks, pointers: frame.pointers, label: frame.label || "sorted[ ]" }));
    });
    const keyInput = numberInput(1047);

    function idle() {
      const list = context.state.sorted.length ? context.state.sorted : context.state.bookings;
      const label = context.state.sorted.length ? "sorted[ ]  (from Stage 5)" : "bookings[ ]  (NOT sorted yet: go to Stage 5, or press Sort now)";
      player.load([{ values: list.slice(), marks: {}, pointers: {}, label, caption: "Type a ticket ID and press Binary search.", checks: 0, moves: 0 }], false);
    }

    async function sortNow() {
      const result = await context.run(() => api.post("/api/sort", { algorithm: "insertion" }));
      if (result) {
        toast("Sorted with insertion sort");
        idle();
      }
    }

    async function search(listName) {
      const key = Number(keyInput.value);
      const result = await context.run(() => api.get("/api/search/binary", { key, list: listName }));
      if (!result) {
        return;
      }
      if (listName === "sorted") {
        recordCost("binary", result.list.length, result.checks, 0);
      }
      const { frames, rows } = binaryFrames(result.list, result.trace, key, result);
      frames.forEach((frame) => {
        frame.label = listName === "sorted" ? "sorted[ ]" : "bookings[ ]  (UNSORTED: watch it go wrong)";
      });
      player.load(frames);
      traceArea.replaceChildren(table(["Check", "low", "high", "mid", "list[mid]", "Decision"], rows, { numeric: [0, 1, 2, 3, 4] }));
      if (listName === "sorted") {
        const linearSorted = result.list.indexOf(key);
        const linearChecks = linearSorted >= 0 ? linearSorted + 1 : result.list.length;
        compareArea.replaceChildren(table(["Method", `Checks for ${key}`, "Worst case for n = " + result.list.length], [
          ["Binary search (sorted list)", String(result.checks), String(Math.floor(Math.log2(result.list.length)) + 1)],
          ["Linear search (same sorted list)", String(linearChecks), String(result.list.length)],
        ], { numeric: [1, 2] }));
      } else {
        const actual = result.list.indexOf(key);
        compareArea.replaceChildren(el("div", { class: "result-line bad" },
          actual >= 0 && result.result < 0
            ? `Binary search said "not found", but ${key} is sitting at index ${actual}. Sorting is the price of fast search.`
            : `Result: ${result.message}. Try a key like 1047 to see binary search miss a ticket that is present.`));
      }
    }

    idle();

    container.append(
      stageHeader(this),
      block("Binary search on the sorted list",
        listArea,
        el("div", { class: "controls" },
          field("ticket ID (key)", keyInput),
          button("Binary search", () => search("sorted")),
          button("Try it on the UNSORTED list", () => search("unsorted"), "ghost"),
          button("Sort now", sortNow, "soft"),
        ),
        player.node,
        traceArea,
        compareArea,
      ),
      block("In real terms",
        el("p", { class: "real-terms" },
          el("strong", {}, "Binary search"), " needs a sorted array. It keeps two edges, low and high, checks the middle, and discards the half that cannot hold the key. When low passes high, the key is absent."),
        el("div", { class: "formula" }, "mid = (low + high) / 2            (whole-number division)\nmaximum checks = floor(log2 n) + 1   n = 8 → 4,  n = 1000 → 10"),
        flow([
          { title: "Input", tint: "grey", chips: ["sorted list", "key 1047"], caption: "must be sorted" },
          { title: "Process", tint: "amber", chips: ["check mid", "drop half"], caption: "repeat until found or empty" },
          { title: "Output", tint: "mint", chips: ["index 6", "3 checks"], caption: "instead of 7" },
        ]),
        takeaway("Binary search is O(log n).", "Doubling the list adds only one more check."),
        limitation("It only works on sorted data. Run it on the unsorted bookings and it can say \"not found\" for a ticket that is there."),
      ),
      codeView("search", "binarySearch"),
    );
  },
};
