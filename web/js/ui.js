// ui.js
// Small helpers for building the page: element creation, toasts, array boxes, seats, and stage headers.

export function el(tag, attributes = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attributes).forEach(([key, value]) => {
    if (value === undefined || value === null || value === false) {
      return;
    }
    if (key === "class") {
      node.className = value;
    } else if (key === "html") {
      node.innerHTML = value;
    } else if (key === "style" && typeof value === "object") {
      Object.assign(node.style, value);
    } else if (key.startsWith("on") && typeof value === "function") {
      node.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (value === true) {
      node.setAttribute(key, "");
    } else {
      node.setAttribute(key, value);
    }
  });
  children.flat().forEach((child) => {
    if (child === undefined || child === null || child === false) {
      return;
    }
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  });
  return node;
}

let toastTimer = null;

export function toast(message, bad = false) {
  const box = document.getElementById("toast");
  box.textContent = message;
  box.classList.toggle("bad", bad);
  box.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    box.hidden = true;
  }, 3200);
}

export function stageHeader(stage) {
  return el("div", {},
    el("div", { class: "stage-header" },
      el("span", { class: "badge" }, stage.number),
      el("div", {},
        el("h1", { class: "stage-title" }, stage.title),
        el("p", { class: "stage-subtitle" }, stage.subtitle),
        el("div", { class: "stage-topic" }, stage.topic),
      ),
    ),
    stage.story ? el("p", { class: "story" }, stage.story) : null,
  );
}

export function block(title, ...children) {
  return el("div", { class: "block" }, title ? el("h3", { class: "block-title" }, title) : null, ...children);
}

export function takeaway(lead, rest) {
  return el("p", { class: "takeaway" }, el("mark", {}, lead), " ", rest);
}

export function limitation(text) {
  return el("p", { class: "limitation" }, text);
}

// Three panels: input (solid) → process (dashed) → output (solid)
export function flow(panels) {
  const node = el("div", { class: "flow" });
  panels.forEach((panel, index) => {
    if (index > 0) {
      node.append(el("div", { class: "flow-arrow", "aria-hidden": "true" }, "→"));
    }
    node.append(el("div", { class: `panel ${index === 1 ? "process" : ""} tint-${panel.tint}` },
      el("h4", {}, panel.title),
      el("div", { class: "chips" }, panel.chips.map((chip) => el("span", { class: "chip" }, chip))),
      panel.caption ? el("div", { class: "caption" }, panel.caption) : null,
    ));
  });
  return node;
}

export function field(label, input) {
  return el("label", { class: "field" }, label, input);
}

export function numberInput(value, attributes = {}) {
  return el("input", { type: "number", value, ...attributes });
}

export function textInput(value, attributes = {}) {
  return el("input", { type: "text", value, ...attributes });
}

export function button(text, onClick, kind = "") {
  return el("button", { type: "button", class: `button ${kind}`, onclick: onClick }, text);
}

// Draws a list of values as numbered boxes.
// options.marks: { index: "visit" | "compare" | "swap" | "move" | "set" | "found" | "done" | "dim" }
// options.pointers: { index: "label" }   options.label: text above the boxes
export function arrayView(values, options = {}) {
  const marks = options.marks || {};
  const pointers = options.pointers || {};
  const capacity = options.capacity || values.length;
  const row = el("div", { class: "array" });
  for (let i = 0; i < capacity; i++) {
    const hasValue = i < values.length && values[i] !== undefined && values[i] !== null;
    const text = hasValue ? (options.format ? options.format(values[i], i) : values[i]) : "";
    const classes = ["box"];
    if (!hasValue) {
      classes.push("empty");
    }
    if (marks[i]) {
      classes.push(...String(marks[i]).split(" "));
    }
    if (options.endMarkerAt === i) {
      classes.push("end-marker");
    }
    row.append(el("div", { class: "cell" },
      el("div", { class: "pointer" }, pointers[i] || ""),
      el("div", { class: classes.join(" ") }, text),
      el("div", { class: "index" }, options.indexLabel ? options.indexLabel(i) : `[${i}]`),
    ));
  }
  return el("div", { class: "array-wrap" },
    options.label ? el("div", { class: "array-label" }, options.label) : null,
    row,
  );
}

export function resultLine(text, good = true) {
  return el("div", { class: `result-line ${good ? "" : "bad"}` }, text);
}

export function table(headers, rows, options = {}) {
  return el("table", { class: "data" },
    el("thead", {}, el("tr", {}, headers.map((header) => el("th", {}, header)))),
    el("tbody", {}, rows.map((cells, rowIndex) =>
      el("tr", { class: options.highlightRow === rowIndex ? "highlight" : "" },
        cells.map((cell, cellIndex) => el("td", { class: options.numeric && options.numeric.includes(cellIndex) ? "num" : "" }, cell))),
    )),
  );
}

export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// "1 check", "6 checks"
export function count(number, word) {
  return `${number} ${word}${number === 1 ? "" : "s"}`;
}
