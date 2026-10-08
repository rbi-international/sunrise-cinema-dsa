// traceFrames.js
// Turns the server's step trace ([[type, a, b, c], ...]) into animation frames for one array.
// Each frame holds a copy of the array after that step, which boxes to colour, and a caption.

import { EVENT } from "./api.js";

const CHECK_EVENTS = new Set([EVENT.VISIT, EVENT.COMPARE, EVENT.RANGE, EVENT.CELL]);
const MOVE_EVENTS = new Set([EVENT.SWAP, EVENT.MOVE, EVENT.SET, EVENT.TAKE]);

// initialValues: the array before the algorithm ran
// trace: the server's step list
// describe(event, valuesBefore, valuesAfter): returns the caption for one step
// options.startCaption / options.endCaption: text for the first and last frames
// options.endMarks: function(values) returning marks for the final frame
export function framesForArray(initialValues, trace, describe, options = {}) {
  const values = initialValues.slice();
  let checks = 0;
  let moves = 0;
  const persistent = {};
  const frames = [{
    values: values.slice(),
    marks: {},
    caption: options.startCaption || "Ready.",
    checks: 0,
    moves: 0,
  }];

  trace.forEach((event) => {
    const [type, a, b] = event;
    const before = values.slice();
    const marks = { ...persistent };
    if (CHECK_EVENTS.has(type)) {
      checks += 1;
    }
    if (MOVE_EVENTS.has(type)) {
      moves += 1;
    }
    if (type === EVENT.VISIT) {
      marks[a] = "visit";
    } else if (type === EVENT.COMPARE) {
      marks[a] = "compare";
      marks[b] = "compare";
    } else if (type === EVENT.SWAP) {
      const temp = values[a];
      values[a] = values[b];
      values[b] = temp;
      marks[a] = "swap";
      marks[b] = "swap";
    } else if (type === EVENT.MOVE) {
      values[b] = values[a];
      marks[b] = "move";
    } else if (type === EVENT.SET) {
      values[a] = b;
      marks[a] = "set";
    } else if (type === EVENT.FOUND) {
      persistent[a] = "found";
      marks[a] = "found";
    }
    if (options.onEvent) {
      options.onEvent(event, values, marks, persistent);
    }
    frames.push({
      values: values.slice(),
      marks,
      caption: describe(event, before, values),
      checks,
      moves,
      event,
    });
  });

  const last = frames[frames.length - 1];
  frames.push({
    values: values.slice(),
    marks: options.endMarks ? options.endMarks(values, persistent) : { ...persistent },
    caption: options.endCaption || "Done.",
    checks,
    moves,
  });
  if (last === frames[0] && trace.length === 0) {
    frames[1].caption = options.endCaption || "Done.";
  }
  return frames;
}
