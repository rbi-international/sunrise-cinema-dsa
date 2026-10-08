// Stage 7: combine online and counter bookings. Two-pointer merge of two sorted arrays.

import { api, EVENT } from "../api.js";
import { el, stageHeader, block, takeaway, limitation, flow, field, textInput, button, arrayView, toast } from "../ui.js";
import { Player } from "../player.js";
import { codeView } from "../codeView.js";
import { recordCost } from "../costLog.js";

function mergeFrames(online, counter, trace, total) {
  const result = new Array(total).fill(null);
  let i = 0;
  let j = 0;
  let checks = 0;
  let moves = 0;
  const frame = (caption, marksA, marksB, marksR) => ({
    online, counter, result: result.slice(), caption, checks, moves,
    marksA, marksB, marksR,
    pointersA: i < online.length ? { [i]: "i" } : {},
    pointersB: j < counter.length ? { [j]: "j" } : {},
  });
  const frames = [frame("Two sorted queues meet at one gate. Fingers i and j start at the front.", {}, {}, {})];
  trace.forEach(([type, a, b, c]) => {
    if (type === EVENT.COMPARE) {
      checks += 1;
      const smaller = online[a] <= counter[b] ? `${online[a]} (online)` : `${counter[b]} (counter)`;
      frames.push(frame(`Compare online[${a}] = ${online[a]} with counter[${b}] = ${counter[b]}. Smaller: ${smaller}.`, { [a]: "compare" }, { [b]: "compare" }, {}));
    } else if (type === EVENT.TAKE) {
      moves += 1;
      const source = a === 0 ? online : counter;
      result[c] = source[b];
      const leftover = (a === 0 && j >= counter.length) || (a === 1 && i >= online.length);
      const caption = `${leftover ? "Leftover: copy" : "Take"} ${source[b]} from ${a === 0 ? "online" : "counter"} into result[${c}].`;
      if (a === 0) {
        i = b + 1;
      } else {
        j = b + 1;
      }
      frames.push(frame(caption, a === 0 ? { [b]: "set" } : {}, a === 1 ? { [b]: "set" } : {}, { [c]: "set" }));
    }
  });
  const done = Object.fromEntries(result.map((_, index) => [index, "done"]));
  frames.push({ ...frame(`Merged ${total} bookings with ${checks} comparisons and ${moves} copies: O(m + n).`, {}, {}, done), pointersA: {}, pointersB: {} });
  return frames;
}

export default {
  number: 7,
  title: "Merge the bookings",
  subtitle: "Two sorted lists become one sorted list in a single pass",
  topic: "Merging two sorted arrays · two pointers",
  story: "Two queues, each already in token order, meet at one gate. The gatekeeper looks only at the two people in front and lets the smaller token through. When one queue empties, the rest of the other walks straight in.",

  mount(container, context) {
    const area = el("div");
    const player = new Player((frame) => {
      area.replaceChildren(
        arrayView(frame.online, { marks: frame.marksA, pointers: frame.pointersA, label: "online[ ]  (app bookings, sorted)" }),
        arrayView(frame.counter, { marks: frame.marksB, pointers: frame.pointersB, label: "counter[ ]  (desk bookings, sorted)" }),
        arrayView(frame.result, { marks: frame.marksR, capacity: frame.result.length, label: "result[ ]" }),
      );
    });

    const onlineInput = textInput(context.state.online.join(","), { class: "wide" });
    const counterInput = textInput(context.state.counter.join(","), { class: "wide" });

    function idle() {
      const total = context.state.online.length + context.state.counter.length;
      player.load([{
        online: context.state.online, counter: context.state.counter, result: new Array(total).fill(null),
        marksA: {}, marksB: {}, marksR: {}, pointersA: { 0: "i" }, pointersB: { 0: "j" },
        caption: "Press Merge to watch the gatekeeper.", checks: 0, moves: 0,
      }], false);
    }

    async function merge() {
      const online = context.state.online.slice();
      const counter = context.state.counter.slice();
      const result = await context.run(() => api.get("/api/merge"));
      if (!result) {
        return;
      }
      recordCost("merge", online.length + counter.length, result.checks, result.moves);
      const frames = mergeFrames(online, counter, result.trace, Math.max(result.result.length, online.length + counter.length));
      if (!result.ok) {
        frames[frames.length - 1].caption = `${result.message}: expected ${online.length + counter.length} sorted values, got ${result.result.length}.`;
      }
      player.load(frames);
      if (!result.ok) {
        toast(result.message, true);
      }
    }

    async function setLists() {
      const result = await context.run(() => api.post("/api/merge/set", { online: onlineInput.value, counter: counterInput.value }));
      if (result) {
        toast("Lists replaced");
        idle();
      }
    }

    idle();

    container.append(
      stageHeader(this),
      block("The gate",
        area,
        el("div", { class: "controls" }, button("Merge", merge)),
        player.node,
        el("div", { class: "controls" },
          field("online list (sorted)", onlineInput),
          field("counter list (sorted)", counterInput),
          button("Use these lists", setLists, "soft"),
        ),
      ),
      block("In real terms",
        el("p", { class: "real-terms" },
          "This is the ", el("strong", {}, "two-pointer merge"), ". Index i walks the first array, j the second, k the result. Every step copies one value, so the total work is m + n. Merge sort, later in the course, is built on exactly this step."),
        flow([
          { title: "Input", tint: "grey", chips: ["online: 4 sorted", "counter: 4 sorted"], caption: "both already sorted" },
          { title: "Process", tint: "amber", chips: ["compare fronts", "take smaller", "copy leftovers"], caption: "one pass" },
          { title: "Output", tint: "mint", chips: ["8 sorted bookings"], caption: "no re-sorting" },
        ]),
        takeaway("Merging two sorted arrays is O(m + n).", "Re-sorting the combined list with bubble sort would cost O((m + n)²)."),
        limitation("Delete the two leftover loops and the last booking (1052) silently disappears. Merging also needs O(m + n) extra space for the result."),
      ),
      codeView("merging"),
    );
  },
};
