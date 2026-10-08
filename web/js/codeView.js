// codeView.js
// "Show the C++ code" panel. Fetches the module's .cpp file from the server, so the page always shows
// the code that is actually running (the complete code, or the student's own starter file).

import { api } from "./api.js";
import { el } from "./ui.js";

const KEYWORDS = /\b(int|bool|char|void|const|return|if|else|for|while|break|true|false|include|using|namespace)\b/g;

function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function highlightLine(line) {
  const commentAt = line.indexOf("//");
  let code = commentAt >= 0 ? line.slice(0, commentAt) : line;
  const comment = commentAt >= 0 ? line.slice(commentAt) : "";
  let html = escapeHtml(code)
    .replace(/("[^"]*"|'[^']*')/g, '<span class="string">$1</span>')
    .replace(KEYWORDS, '<span class="keyword">$1</span>');
  if (comment) {
    html += `<span class="comment">${escapeHtml(comment)}</span>`;
  }
  const isTodo = /TODO/.test(line);
  return `<span class="line${isTodo ? " todo" : ""}">${html || " "}</span>`;
}

export function codeView(moduleName, focusFunction) {
  const pre = el("pre", { class: "code" }, "Loading…");
  const pathNode = el("span", { class: "speed-label" }, "");
  const details = el("details", { class: "code-view" },
    el("summary", {}, `Show the C++ code (${moduleName}.cpp)`, " ", pathNode),
    pre,
  );
  let loaded = false;
  details.addEventListener("toggle", async () => {
    if (!details.open || loaded) {
      return;
    }
    try {
      const result = await api.source(moduleName);
      loaded = true;
      pathNode.textContent = `· running from ${result.path}`;
      const lines = result.code.replace(/\r/g, "").split("\n");
      pre.innerHTML = lines.map(highlightLine).join("");
      if (focusFunction) {
        const index = lines.findIndex((line) => line.includes(focusFunction + "("));
        if (index >= 0) {
          const target = pre.children[index];
          target.style.background = "rgba(255, 229, 138, 0.14)";
        }
      }
    } catch (error) {
      pre.textContent = error.message;
    }
  });
  return details;
}
