// Stage 3: the waitlist. Insertion and deletion at a position, with shifting.

import { api, EVENT } from "../api.js";
import { el, stageHeader, block, takeaway, limitation, flow, field, numberInput, button, toast, arrayView } from "../ui.js";
import { Player } from "../player.js";
import { codeView } from "../codeView.js";
import { framesForArray } from "../traceFrames.js";
import { recordCost } from "../costLog.js";

export default {
  number: 3,
  title: "The waitlist",
  subtitle: "A VIP joins in the middle, so everyone behind steps back",
  topic: "Insertion · deletion · shifting",
  story: "People stand on painted floor squares. A VIP must stand on square 1. Everyone from square 1 onward steps back one square, starting from the LAST person, otherwise they bump into each other.",

  mount(container, context) {
    const listArea = el("div");
    const capacity = context.state.waitCapacity;
    const shown = () => Math.min(capacity, Math.max(context.state.waitlist.length + 2, 6));

    const player = new Player((frame) => {
      listArea.replaceChildren(arrayView(frame.values, { marks: frame.marks, capacity: frame.capacity || shown(), label: "waitlist[ ]  (ticket IDs)" }));
    });

    const positionInput = numberInput(1, { min: "0" });
    const valueInput = numberInput(1020);

    async function act(kind) {
      const position = Number(positionInput.value);
      const params = kind === "insert" ? { position, value: Number(valueInput.value) } : { position };
      const result = await context.run(() => api.post(`/api/waitlist/${kind}`, params));
      if (!result) {
        return;
      }
      toast(result.message, !result.ok);
      const before = result.before;
      const shifts = result.trace.filter((event) => event[0] === EVENT.MOVE).length;
      if (result.ok) {
        recordCost(kind === "insert" ? "insert" : "delete", before.length, result.checks, result.moves);
      }
      // the array visual has one extra empty box at the end for insertion
      const working = before.slice();
      const boxes = Math.min(capacity, Math.max(before.length + 2, 6));
      const frames = framesForArray(working, result.trace, (event) => {
        if (event[0] === EVENT.MOVE) {
          return `Move the person on square ${event[1]} to square ${event[2]}.`;
        }
        if (event[0] === EVENT.SET) {
          return `The newcomer ${event[2]} stands on square ${event[1]}.`;
        }
        return "";
      }, {
        startCaption: result.ok ? (kind === "insert" ? `Make a gap at square ${position}…` : `Square ${position} leaves; close the gap…`) : result.message,
        endCaption: result.ok
          ? `${result.message}. People moved: ${shifts}. With ${before.length} people, position ${position} moves n − p${kind === "delete" ? " − 1" : ""} = ${shifts}.`
          : `${result.message}. Nothing moved.`,
      });
      // after a delete the last box is stale; trim the final frame to the new length
      frames[frames.length - 1].values = context.state.waitlist.slice();
      frames.forEach((frame) => {
        frame.capacity = boxes;
      });
      player.load(frames);
    }

    player.load([{ values: context.state.waitlist.slice(), marks: {}, caption: "Choose a position and press Insert or Delete.", checks: 0, moves: 0 }], false);

    container.append(
      stageHeader(this),
      block("The waitlist",
        listArea,
        el("div", { class: "controls" },
          field("position p", positionInput),
          field("ticket ID", valueInput),
          button("Insert at p", () => act("insert")),
          button("Delete at p", () => act("delete"), "ghost"),
        ),
        player.node,
      ),
      block("In real terms",
        el("p", { class: "real-terms" },
          "Array boxes cannot stretch. ", el("strong", {}, "Inserting"), " at position p shifts elements p … n−1 one place right, starting from the end. ",
          el("strong", {}, "Deleting"), " at p shifts elements p+1 … n−1 one place left. Two checks come first: is the list full, and is p valid?"),
        flow([
          { title: "Before", tint: "grey", chips: ["1012", "1005", "1033"], caption: "3 people waiting" },
          { title: "Shift from the end", tint: "rose", chips: ["1033 → [3]", "1005 → [2]"], caption: "2 moves for p = 1" },
          { title: "After", tint: "mint", chips: ["1012", "1020", "1005", "1033"], caption: "VIP at square 1" },
        ]),
        el("div", { class: "formula" }, "insert at p : moves = n − p        best O(1) at the end, worst O(n) at the front\ndelete at p : moves = n − p − 1    best O(1) at the end, worst O(n) at the front"),
        takeaway("Insert and delete in an array cost O(n).", "The work is the shifting, not the writing."),
        limitation("Shifting right must start from the end. Run the loop forward and each move overwrites the next person: 1012 1020 1005 1005, and 1033 is lost."),
      ),
      block("Break it (5 minutes)",
        el("p", { class: "real-terms" }, "Try position 9 with only 3 people waiting, or position −1. The C++ code must refuse, and the count must stay the same. Then fill the list to 20 and try once more."),
      ),
      codeView("waitlist"),
    );
  },
};
