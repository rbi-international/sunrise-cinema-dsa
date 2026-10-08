// common.js
// Drawing helpers shared by several stages: the seat row, the hall grid, and trace-to-caption text.

import { el } from "../ui.js";

// One row of seats. marks: { index: "visit" | "found" | "set" }
export function seatRow(row, options = {}) {
  const marks = options.marks || {};
  return el("div", {},
    el("div", { class: "screen" }),
    el("div", { class: "screen-label" }, "SCREEN"),
    el("div", { class: "seat-row" }, row.map((value, index) =>
      el("button", {
        type: "button",
        class: `seat ${value === 1 ? "booked" : ""} ${marks[index] || ""}`,
        title: `Seat ${index}: ${value === 1 ? "booked" : "free"}`,
        onclick: options.onSeat ? () => options.onSeat(index, value) : null,
        "aria-label": `Seat ${index} ${value === 1 ? "booked" : "free"}`,
      }, value === 1 ? "X" : String(index)),
    )),
    el("div", { class: "seat-row", style: { marginTop: "4px" } }, row.map((_, index) =>
      el("div", { class: "index", style: { width: "46px", textAlign: "center" } }, `seat[${index}]`),
    )),
  );
}

// The full hall. marks: { "r,c": "visit" | "found" }
export function hallGrid(hall, options = {}) {
  const marks = options.marks || {};
  return el("div", { class: "hall" },
    el("div", { class: "screen" }),
    el("div", { class: "screen-label" }, "SCREEN"),
    hall.map((row, r) =>
      el("div", { class: "hall-row" },
        el("span", { class: "row-label" }, `row ${r}`),
        row.map((value, c) =>
          el("button", {
            type: "button",
            class: `seat ${value === 1 ? "booked" : ""} ${marks[`${r},${c}`] || ""}`,
            title: `hall[${r}][${c}]: ${value === 1 ? "booked" : "free"}`,
            onclick: options.onSeat ? () => options.onSeat(r, c, value) : null,
          }, value === 1 ? "X" : String(c)),
        ),
      ),
    ),
  );
}
