// Stage 4: find the first free seat. Linear search with a step counter.

import { api } from "../api.js";
import { el, stageHeader, block, takeaway, limitation, flow, field, numberInput, button, arrayView, toast, count } from "../ui.js";
import { Player } from "../player.js";
import { codeView } from "../codeView.js";
import { framesForArray } from "../traceFrames.js";
import { recordCost } from "../costLog.js";
import { seatRow } from "./common.js";

export default {
  number: 4,
  title: "Find a free seat",
  subtitle: "Walk the row with a torch and count every look",
  topic: "Linear search · best, worst and average case",
  story: "An usher with a torch walks down the row: taken, taken, taken, free! Each look costs one step. If every seat is taken, the usher looks at all of them.",

  mount(container, context) {
    const rowArea = el("div");
    const rowPlayer = new Player((frame) => {
      rowArea.replaceChildren(seatRow(frame.values, { marks: frame.marks, onSeat: toggleSeat }));
    });

    async function toggleSeat(index, value) {
      const path = value === 1 ? "/api/row/cancel" : "/api/row/book";
      const result = await context.run(() => api.post(path, { seat: index }));
      if (result) {
        rowPlayer.load([{ values: context.state.row.slice(), marks: {}, caption: "Row changed. Press Find to search again.", checks: 0, moves: 0 }], false);
      }
    }

    async function classExample() {
      for (const seat of [0, 1, 3]) {
        if (context.state.row[seat] === 0) {
          await context.run(() => api.post("/api/row/book", { seat }));
        }
      }
      rowPlayer.load([{ values: context.state.row.slice(), marks: {}, caption: "Seats 0, 1 and 3 booked as in the teaching guide. Now press Find.", checks: 0, moves: 0 }], false);
    }

    async function findSeat() {
      const before = context.state.row.slice();
      const result = await context.run(() => api.get("/api/search/free-seat"));
      if (!result) {
        return;
      }
      recordCost("linear", before.length, result.checks, result.moves);
      rowPlayer.load(framesForArray(before, result.trace, (event, values) => {
        if (event[0] === 7) {
          return `Seat ${event[1]} is free. Stop here.`;
        }
        return `Torch on seat[${event[1]}]: ${values[event[1]] === 1 ? "taken" : "free"}.`;
      }, {
        startCaption: "Start at seat 0 and look at each seat in turn.",
        endCaption: result.ok ? `First free seat: ${result.result}, found after ${count(result.checks, "check")}.` : result.checks === 0 ? "No seat was checked: findFreeSeat has not looked at anything yet." : `House full: all ${result.checks} seats checked.`,
      }));
    }

    const listArea = el("div");
    const listPlayer = new Player((frame) => {
      listArea.replaceChildren(arrayView(frame.values, { marks: frame.marks, label: "bookings[ ]  (booking order, not sorted)" }));
    });
    const keyInput = numberInput(1052);

    async function searchTicket() {
      const key = Number(keyInput.value);
      const result = await context.run(() => api.get("/api/search/linear", { key }));
      if (!result) {
        return;
      }
      toast(result.message, !result.ok);
      listPlayer.load(framesForArray(result.list, result.trace, (event, values) => {
        if (event[0] === 7) {
          return `Found ${key} at index ${event[1]}.`;
        }
        return `Is bookings[${event[1]}] = ${values[event[1]]} equal to ${key}? ${values[event[1]] === key ? "Yes." : "No."}`;
      }, {
        startCaption: `Search for ticket ${key}, one by one.`,
        endCaption: `${result.message} after ${count(result.checks, "check")} (n = ${result.list.length}).`,
      }));
    }

    rowPlayer.load([{ values: context.state.row.slice(), marks: {}, caption: "Click seats to book them, then press Find.", checks: 0, moves: 0 }], false);
    listPlayer.load([{ values: context.state.bookings.slice(), marks: {}, caption: "Type a ticket ID and press Search.", checks: 0, moves: 0 }], false);

    container.append(
      stageHeader(this),
      block("Find the first free seat",
        rowArea,
        el("div", { class: "controls" },
          button("Find first free seat", findSeat),
          button("Class example: also book seats 0, 1, 3", classExample, "ghost"),
        ),
        rowPlayer.node,
      ),
      block("Find a ticket in the booking list",
        listArea,
        el("div", { class: "controls" }, field("ticket ID (key)", keyInput), button("Search", searchTicket)),
        listPlayer.node,
      ),
      block("In real terms",
        el("p", { class: "real-terms" },
          el("strong", {}, "Linear (sequential) search"), " compares the key with each element in order until it matches or the list ends. It works on any array, sorted or not."),
        flow([
          { title: "Best case", tint: "mint", chips: ["key at index 0", "1 check"], caption: "Ω(1)" },
          { title: "Average case", tint: "amber", chips: ["about (n + 1) / 2 checks"], caption: "Θ(n)" },
          { title: "Worst case", tint: "rose", chips: ["last or absent", "n checks"], caption: "O(n)" },
        ]),
        takeaway("Search in an unsorted array is O(n).", "Remember the Stage 1 poll: going to seat 7 is 1 step at any hall size; finding a free seat grows with the row."),
        limitation("Seat 5 is free, yet the torch needs 6 checks: indexes 0 to 5 are six seats."),
      ),
      codeView("search", "findFreeSeat"),
    );
  },
};
