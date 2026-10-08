// Stage 9: customer names. Strings as char arrays ending in '\0', and string operations.

import { api } from "../api.js";
import { el, stageHeader, block, takeaway, limitation, flow, field, textInput, button, arrayView, toast } from "../ui.js";
import { Player } from "../player.js";
import { codeView } from "../codeView.js";
import { framesForArray } from "../traceFrames.js";
import { recordCost } from "../costLog.js";

export default {
  number: 9,
  title: "Customer names",
  subtitle: "A name is a row of letter tiles with a hidden end tile",
  topic: "Strings as char arrays · length · compare · search",
  story: "A name is a row of letter tiles with a hidden \"end\" tile after the last letter. Without that end tile, nobody knows where Aman stops. A list of names is a rack of such rows: a 2D array of letters.",

  mount(container, context) {
    // letters of one name
    const tileArea = el("div");
    const tilePlayer = new Player((frame) => {
      tileArea.replaceChildren(arrayView(frame.values, {
        marks: frame.marks,
        label: `char name[${context.state.nameLength}]`,
        capacity: frame.values.length,
        format: (value) => (value === 0 ? "\\0" : String.fromCharCode(value)),
        endMarkerAt: frame.values.length - 1,
      }), frame.codes ? arrayView(frame.values, { label: "ASCII codes", format: (value) => value, capacity: frame.values.length }) : "");
    });
    const inspectInput = textInput("Simran");
    const inspectOut = el("div");

    async function inspect() {
      const name = inspectInput.value;
      const result = await context.run(() => api.get("/api/names/inspect", { name }));
      if (!result) {
        return;
      }
      recordCost("strlen", result.length, result.checks, 0);
      const codes = result.asciiCodes;
      const frames = framesForArray(codes, result.trace, (event) =>
        `Letter ${event[1] + 1}: '${name[event[1]]}' is not the end marker, keep counting.`, {
        startCaption: "myLength walks the tiles until it meets '\\0'.",
        endCaption: `Hit '\\0' after ${result.length} letters. Length = ${result.length}; the array needs at least ${result.length + 1} ${result.length + 1 === 1 ? "box" : "boxes"}.`,
      });
      frames.forEach((frame) => {
        frame.codes = true;
      });
      tilePlayer.load(frames);
      inspectOut.replaceChildren(el("p", { class: "real-terms" },
        `toUpperCase gives "${result.upper}". Each small letter drops by 32 in ASCII: 'a' = 97 becomes 'A' = 65.`));
    }

    // list of names
    const listArea = el("div");
    const listPlayer = new Player((frame) => {
      listArea.replaceChildren(arrayView(frame.values, {
        marks: frame.marks,
        capacity: context.state.nameCapacity,
        label: `char names[${context.state.nameCapacity}][${context.state.nameLength}]`,
        indexLabel: (i) => `names[${i}]`,
      }));
    });
    const nameInput = textInput("Simran");

    function idleList(caption) {
      listPlayer.load([{ values: context.state.names.slice(), marks: {}, caption: caption || "Add a name or search for one.", checks: 0, moves: 0 }], false);
    }

    async function addName() {
      const result = await context.run(() => api.post("/api/names/add", { name: nameInput.value }));
      if (result) {
        toast(result.message, !result.ok);
        idleList(result.message);
      }
    }

    async function findName() {
      const key = nameInput.value;
      const names = context.state.names.slice();
      const result = await context.run(() => api.get("/api/names/find", { name: key }));
      if (!result) {
        return;
      }
      recordCost("nameSearch", names.length, result.checks, 0);
      listPlayer.load(framesForArray(names, result.trace, (event) => {
        if (event[0] === 7) {
          return `Every letter matches: "${key}" is names[${event[1]}].`;
        }
        return `Compare "${names[event[1]]}" with "${key}" letter by letter: ${names[event[1]] === key ? "same" : "different"}.`;
      }, {
        startCaption: `Search for "${key}" (each check compares whole names).`,
        endCaption: result.ok ? `${result.message}.` : `"${key}" not found. ${/[a-z]/.test(key[0] || "") ? "Capital letters matter: 's' (115) is not 'S' (83)." : ""}`,
      }));
    }

    tilePlayer.load([{ values: [83, 105, 109, 114, 97, 110, 0], marks: {}, caption: "Type a name and press Inspect.", checks: 0, moves: 0 }], false);
    idleList();

    container.append(
      stageHeader(this),
      block("Inside one name",
        tileArea,
        el("div", { class: "controls" }, field("name", inspectInput), button("Inspect (length and capitals)", inspect)),
        tilePlayer.node,
        inspectOut,
      ),
      block("The name list",
        listArea,
        el("div", { class: "controls" },
          field("name", nameInput),
          button("Add customer", addName),
          button("Find customer", findName, "ghost"),
        ),
        listPlayer.node,
      ),
      block("In real terms",
        el("p", { class: "real-terms" },
          "A C-style string is a ", el("strong", {}, "char array ending with '\\0'"), ". char names[10][20] holds up to 10 names of up to 19 letters (one box is kept for '\\0'). ",
          el("strong", {}, "strcpy"), " copies a string. Our own sameName compares letter by letter, the same job as strcmp."),
        flow([
          { title: "Input", tint: "grey", chips: ["\"Simran\""], caption: "6 letters + '\\0'" },
          { title: "Process", tint: "amber", chips: ["walk to '\\0'", "compare letters"], caption: "O(L) per name" },
          { title: "Output", tint: "mint", chips: ["length 6", "index 1"], caption: "search is O(n × L)" },
        ]),
        takeaway("String length and comparison are O(L).", "Finding one name among n names is O(n × L)."),
        limitation("Never compare two char arrays with ==; it compares addresses, not letters. And \"simran\" is not \"Simran\": convert both to capitals first if case should not matter."),
      ),
      codeView("customer_names"),
    );
  },
};
