// Stage 8: the full hall. 2D array, nested traversal, row-major and column-major address calculation.

import { api } from "../api.js";
import { el, stageHeader, block, takeaway, limitation, field, numberInput, button, toast, resultLine } from "../ui.js";
import { Player } from "../player.js";
import { codeView } from "../codeView.js";
import { recordCost } from "../costLog.js";
import { hallGrid } from "./common.js";

function corridor(rows, cols, targetRow, targetCol, order) {
  const slots = [];
  const total = rows * cols;
  let targetPosition = 0;
  for (let k = 0; k < total; k++) {
    const r = order === "row" ? Math.floor(k / cols) : k % rows;
    const c = order === "row" ? k % cols : Math.floor(k / rows);
    if (r === targetRow && c === targetCol) {
      targetPosition = k;
    }
  }
  for (let k = 0; k < total; k++) {
    const r = order === "row" ? Math.floor(k / cols) : k % rows;
    const c = order === "row" ? k % cols : Math.floor(k / rows);
    const group = order === "row" ? r : c;
    const classes = ["slot", group % 2 === 0 ? "row-a" : "row-b"];
    if (k < targetPosition) {
      classes.push("passed");
    }
    if (k === targetPosition) {
      classes.push("target");
    }
    slots.push(el("div", { class: classes.join(" "), title: `box ${k}: [${r}][${c}]` }, `${r},${c}`));
  }
  return { node: el("div", { class: "corridor" }, slots), skipped: targetPosition };
}

export default {
  number: 8,
  title: "The full hall",
  subtitle: "Memory is one long corridor, so the grid must be laid down in a line",
  topic: "2D array · row-major · column-major address",
  story: "Memory is not a grid; it is one long corridor of boxes. To find Row 2, Seat 3 when rows are laid down one after another, skip 2 full rows of 10 seats, then 3 more seats: 23 boxes from the start.",

  mount(container, context) {
    const hallArea = el("div");
    const player = new Player((frame) => {
      hallArea.replaceChildren(hallGrid(frame.hall, { marks: frame.marks, onSeat }));
    });

    function idle(caption) {
      player.load([{ hall: context.state.hall, marks: {}, caption: caption || "Click a seat to book or cancel it.", checks: 0, moves: 0 }], false);
    }

    async function onSeat(r, c, value) {
      const result = await context.run(() => api.post(value === 1 ? "/api/hall/cancel" : "/api/hall/book", { row: r, col: c }));
      if (result) {
        toast(result.message, !result.ok);
        idle(`${result.message}: one direct jump to hall[${r}][${c}], O(1).`);
      }
    }

    async function count() {
      const hall = context.state.hall.map((row) => row.slice());
      const result = await context.run(() => api.get("/api/hall/count"));
      if (!result) {
        return;
      }
      recordCost("traversal2d", hall.length * hall[0].length, result.checks, 0);
      let found = 0;
      const frames = [{ hall, marks: {}, caption: "Outer loop picks a row, inner loop walks its seats.", checks: 0, moves: 0 }];
      result.trace.forEach(([, r, c], k) => {
        found += hall[r][c];
        frames.push({ hall, marks: { [`${r},${c}`]: "visit" }, caption: `hall[${r}][${c}] is ${hall[r][c] === 1 ? "booked" : "free"}. Booked so far: ${found}.`, checks: k + 1, moves: 0 });
      });
      frames.push({ hall, marks: {}, caption: `${result.result} booked seats after ${result.checks} checks: ${hall.length} rows × ${hall[0].length} seats. O(M × N).`, checks: result.checks, moves: 0 });
      player.load(frames);
    }

    // address calculator
    const inputs = {
      row: numberInput(2), col: numberInput(3),
      rows: numberInput(5, { min: "1" }), cols: numberInput(10, { min: "1" }),
      base: numberInput(2000), width: numberInput(4, { min: "1" }),
      lr: numberInput(0), lc: numberInput(0),
    };
    const out = el("div");
    const corridorArea = el("div");
    let order = "row";

    function drawCorridor() {
      const rows = Number(inputs.rows.value);
      const cols = Number(inputs.cols.value);
      const i = Number(inputs.row.value) - Number(inputs.lr.value);
      const j = Number(inputs.col.value) - Number(inputs.lc.value);
      if (rows * cols > 120 || i < 0 || j < 0 || i >= rows || j >= cols) {
        corridorArea.replaceChildren(el("p", { class: "real-terms" }, "The corridor picture is drawn for halls up to 120 boxes with the seat inside the hall."));
        return;
      }
      const picture = corridor(rows, cols, i, j, order);
      corridorArea.replaceChildren(
        el("div", { class: "controls" },
          button("Row-major (C++)", () => { order = "row"; drawCorridor(); }, order === "row" ? "soft" : "ghost"),
          button("Column-major", () => { order = "column"; drawCorridor(); }, order === "column" ? "soft" : "ghost"),
        ),
        picture.node,
        el("p", { class: "real-terms" }, `${order === "row" ? "Row-major" : "Column-major"}: ${picture.skipped} boxes are skipped before the target (dark green).`),
      );
    }

    async function calculate() {
      const params = Object.fromEntries(Object.entries(inputs).map(([key, input]) => [key, Number(input.value)]));
      const result = await context.run(() => api.get("/api/hall/address", params));
      if (!result) {
        return;
      }
      const { row: i, col: j, rows: M, cols: N, base, width: w, lr, lc } = params;
      const rowOffset = (i - lr) * N + (j - lc);
      const colOffset = (j - lc) * M + (i - lr);
      out.replaceChildren(
        el("div", { class: "formula" }, [
          "Row-major:    LOC(A[i][j]) = Base + w × [(i − Lr) × N + (j − Lc)]",
          `                          = ${base} + ${w} × [(${i} − ${lr}) × ${N} + (${j} − ${lc})]`,
          `                          = ${base} + ${w} × ${rowOffset} = ${result.rowMajor}`,
          "",
          "Column-major: LOC(A[i][j]) = Base + w × [(j − Lc) × M + (i − Lr)]",
          `                          = ${base} + ${w} × [(${j} − ${lc}) × ${M} + (${i} − ${lr})]`,
          `                          = ${base} + ${w} × ${colOffset} = ${result.columnMajor}`,
        ].join("\n")),
        result.realOffsetBytes === null
          ? el("p", { class: "real-terms" }, "A real C++ check runs only for the actual hall: 0-based, 5 × 10, with w = sizeof(int).")
          : resultLine(`Real C++ check: &hall[${i}][${j}] is ${result.realOffsetBytes} bytes after &hall[0][0]. ${result.realMatchesRowMajor ? "C++ really is row-major." : "Mismatch."}`, result.realMatchesRowMajor),
      );
      drawCorridor();
    }

    idle();
    calculate();

    container.append(
      stageHeader(this),
      block("The hall (int hall[5][10])",
        hallArea,
        el("div", { class: "controls" }, button("Count booked seats (nested loops)", count)),
        player.node,
      ),
      block("Hand calculation duel, then check",
        el("p", { class: "real-terms" }, "Students post their answers in chat first. Then press Calculate."),
        el("div", { class: "controls" },
          field("i (row)", inputs.row), field("j (column)", inputs.col),
          field("M (rows)", inputs.rows), field("N (columns)", inputs.cols),
          field("Base", inputs.base), field("w", inputs.width),
          field("Lr", inputs.lr), field("Lc", inputs.lc),
          button("Calculate", calculate, "soft"),
        ),
        el("div", { class: "controls" },
          button("Exam example: A[1:10][1:15], A[5][8]", () => {
            Object.assign(inputs.row, { value: 5 }); Object.assign(inputs.col, { value: 8 });
            Object.assign(inputs.rows, { value: 10 }); Object.assign(inputs.cols, { value: 15 });
            Object.assign(inputs.base, { value: 100 }); Object.assign(inputs.width, { value: 4 });
            Object.assign(inputs.lr, { value: 1 }); Object.assign(inputs.lc, { value: 1 });
            calculate();
          }, "ghost"),
          button("Our hall: hall[2][3]", () => {
            Object.assign(inputs.row, { value: 2 }); Object.assign(inputs.col, { value: 3 });
            Object.assign(inputs.rows, { value: 5 }); Object.assign(inputs.cols, { value: 10 });
            Object.assign(inputs.base, { value: 2000 }); Object.assign(inputs.width, { value: context.state.sizeofInt });
            Object.assign(inputs.lr, { value: 0 }); Object.assign(inputs.lc, { value: 0 });
            calculate();
          }, "ghost"),
        ),
        out,
        el("h3", { class: "block-title", style: { marginTop: "18px" } }, "The memory corridor"),
        corridorArea,
      ),
      block("In real terms",
        el("p", { class: "real-terms" },
          el("strong", {}, "int hall[5][10]"), " has M = 5 rows and N = 10 columns. C and C++ store it ", el("strong", {}, "row-major"),
          ": all of row 0, then all of row 1. Base is the first address, w the bytes per box, Lr and Lc the first row and column index (0 in C++, often 1 in exam questions)."),
        takeaway("2D access is O(1); a full 2D traversal is O(M × N).", "The formula is why seat [2][3] costs the same as seat [0][0]."),
        limitation("hall[5][2] does not exist, yet C++ usually compiles and runs it without complaint, quietly writing outside the hall."),
        el("p", { class: "real-terms" }, el("strong", {}, "Optional (sparse matrix): "),
          "a 50-seat hall with 4 bookings stores 50 ints. Storing only (row, column, value) triplets for booked seats needs 4 × 3 = 12 ints plus one header triplet: 15 ints. Worth it when most values are zero."),
      ),
      codeView("hall"),
    );
  },
};
