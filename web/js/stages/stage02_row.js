// Stage 2: one row. 1D array, traversal, update, address of an element.

import { api, EVENT } from "../api.js";
import { el, stageHeader, block, takeaway, limitation, flow, field, numberInput, button, toast, resultLine } from "../ui.js";
import { Player } from "../player.js";
import { codeView } from "../codeView.js";
import { framesForArray } from "../traceFrames.js";
import { recordCost } from "../costLog.js";
import { seatRow } from "./common.js";

export default {
  number: 2,
  title: "One row",
  subtitle: "Jump straight to any seat, or walk the whole row",
  topic: "1D array · traversal · update · address of A[i]",
  story: "Seats are numbered boxes standing side by side. Because every box has the same width, if you know where box 0 starts you can walk straight to box 4: skip 4 boxes. Nobody checks boxes 0 to 3 first.",

  mount(container, context) {
    const rowArea = el("div");
    const player = new Player((frame) => {
      rowArea.replaceChildren(seatRow(frame.values, { marks: frame.marks, onSeat }));
    });

    async function onSeat(index, value) {
      const before = context.state.row.slice();
      const path = value === 1 ? "/api/row/cancel" : "/api/row/book";
      const result = await context.run(() => api.post(path, { seat: index }));
      if (!result) {
        return;
      }
      toast(result.message, !result.ok);
      recordCost("access", before.length, result.checks, result.moves);
      player.load(framesForArray(before, result.trace, (event) => {
        if (event[0] === EVENT.VISIT) {
          return `Jump straight to seat[${event[1]}]: one check, no walking.`;
        }
        if (event[0] === EVENT.SET) {
          return `Write ${event[2]} into seat[${event[1]}] (${event[2] === 1 ? "booked" : "free"}).`;
        }
        return "";
      }, {
        startCaption: `Book or cancel seat ${index}…`,
        endCaption: `${result.message}. Cost: ${result.checks} check, whatever the size of the row. That is O(1).`,
      }));
    }

    async function countFree() {
      const before = context.state.row.slice();
      const result = await context.run(() => api.get("/api/row/count-free"));
      if (!result) {
        return;
      }
      recordCost("traversal", before.length, result.checks, result.moves);
      let freeSoFar = 0;
      player.load(framesForArray(before, result.trace, (event, values) => {
        const index = event[1];
        if (values[index] === 0) {
          freeSoFar += 1;
        }
        return `Visit seat[${index}]: ${values[index] === 0 ? "free" : "booked"}. Free so far: ${freeSoFar}.`;
      }, {
        startCaption: "Traversal: visit every seat once, left to right.",
        endCaption: `${result.result} free seats, after ${result.checks} checks. Ten seats, ten visits: traversal is O(n).`,
      }));
    }

    // address calculator
    const indexInput = numberInput(4, { min: "0" });
    const baseInput = numberInput(1000);
    const widthInput = numberInput(context.state ? context.state.sizeofInt : 4, { min: "1" });
    const lowerInput = numberInput(0);
    const addressOut = el("div");

    async function calculate() {
      const index = Number(indexInput.value);
      const base = Number(baseInput.value);
      const width = Number(widthInput.value);
      const lb = Number(lowerInput.value);
      const result = await context.run(() => api.get("/api/row/address", { index, base, width, lb }));
      if (!result) {
        return;
      }
      const lines = [
        "LOC(A[i]) = Base + w × (i − LB)",
        `          = ${base} + ${width} × (${index} − ${lb})`,
        `          = ${base} + ${width * (index - lb)}`,
        `          = ${result.formula}`,
      ];
      const real = result.realOffsetBytes === null
        ? el("p", { class: "real-terms" }, `There is no seat[${index}] in this row, so the computer cannot show a real address for it.`)
        : resultLine(`Real C++ check: &seat[${index}] is ${result.realOffsetBytes} bytes after &seat[0] (sizeof(int) = ${result.sizeofInt}). ${result.realMatchesFormula ? "The formula matches the real memory." : "Mismatch."}`, result.realMatchesFormula);
      addressOut.replaceChildren(el("div", { class: "formula" }, lines.join("\n")), real);
    }

    player.load([{ values: context.state.row.slice(), marks: {}, caption: "Click any seat to book it, or click a booked seat to cancel.", checks: 0, moves: 0 }], false);
    calculate();

    container.append(
      stageHeader(this),
      block("The row (click a seat)",
        rowArea,
        el("div", { class: "controls" },
          button("Count free seats (traversal)", countFree),
        ),
        player.node,
      ),
      block("In real terms",
        el("p", { class: "real-terms" },
          "An ", el("strong", {}, "array"), " is a block of equal-sized boxes in continuous memory. The ", el("strong", {}, "index"),
          " is the box number, starting at 0. Visiting every box once is ", el("strong", {}, "traversal"), " (O(n)). Writing into one box is an ",
          el("strong", {}, "update"), " (O(1))."),
        flow([
          { title: "Input", tint: "grey", chips: ["seat number 4"], caption: "what the customer asks" },
          { title: "Process", tint: "amber", chips: ["Base + 4 × w"], caption: "one multiplication, one addition" },
          { title: "Output", tint: "mint", chips: ["address of seat[4]"], caption: "no walking needed" },
        ]),
      ),
      block("Address calculator",
        el("div", { class: "controls" },
          field("index i", indexInput),
          field("Base address", baseInput),
          field("w (bytes per box)", widthInput),
          field("lower bound LB", lowerInput),
          button("Calculate", calculate, "soft"),
        ),
        addressOut,
        takeaway("Access by index is O(1).", "The cost does not grow when the row grows."),
        limitation("Indexes start at 0 in C++. Seat 4 is the fifth box. And never assume int is 2 bytes: sizeof(int) tells the truth for your machine."),
      ),
      codeView("seat_row"),
    );
  },
};
