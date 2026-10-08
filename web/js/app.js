// app.js
// Starts the page: checks the server, draws the stage menu, and shows one stage at a time.
// The address bar remembers the stage (#/stage/4), so a refresh or a shared link opens the same stage.

import { api } from "./api.js";
import { el, toast } from "./ui.js";
import { stages } from "./stages/index.js";
import { markVisited, visitedStages } from "./costLog.js";

const nav = document.getElementById("stage-nav");
const view = document.getElementById("stage-view");
const modeBadge = document.getElementById("mode-badge");
const warning = document.getElementById("server-warning");

const context = {
  state: null,
  info: null,
  online: false,
  setState(newState) {
    if (newState) {
      context.state = newState;
    }
  },
  async refreshState() {
    try {
      const result = await api.state();
      context.state = result.state;
      setOnline(true);
    } catch (error) {
      setOnline(false);
    }
    return context.state;
  },
  // Wraps an API call: shows the error as a toast, keeps the cinema state up to date.
  async run(action) {
    try {
      const result = await action();
      setOnline(true);
      if (result && result.state) {
        context.state = result.state;
      }
      const setupMessage = /restored|shuffled|replaced/.test((result && result.message) || "");
      if (context.info && context.info.mode === "starter" && result && Array.isArray(result.trace)
          && result.trace.length === 0 && !setupMessage) {
        setTimeout(() => toast("No steps were recorded. If this stage's TODOs in starter/src/ are not finished yet, that is why. Finish them, then restart the server."), 60);
      }
      return result;
    } catch (error) {
      if (error.offline) {
        setOnline(false);
      }
      toast(error.message, true);
      return null;
    }
  },
};

function setOnline(online) {
  context.online = online;
  warning.hidden = online;
  if (!online) {
    modeBadge.textContent = "server offline";
    modeBadge.className = "mode-badge offline";
  }
}

function currentStageNumber() {
  const match = window.location.hash.match(/stage\/(\d+)/);
  const number = match ? Number(match[1]) : 1;
  return stages.some((stage) => stage.number === number) ? number : 1;
}

function drawNav(activeNumber) {
  const visited = visitedStages();
  nav.replaceChildren(...stages.map((stage) =>
    el("button", {
      type: "button",
      class: `nav-item ${stage.number === activeNumber ? "active" : ""}`,
      onclick: () => {
        window.location.hash = `#/stage/${stage.number}`;
      },
    },
      el("span", { class: "badge small" }, stage.number),
      el("span", {}, stage.navTitle || stage.title, el("span", { class: "nav-topic" }, stage.navTopic || stage.topic)),
      visited.has(stage.number) && stage.number !== activeNumber ? el("span", { class: "done-dot", title: "visited" }) : null,
    ),
  ));
}

let currentCleanup = null;

async function showStage() {
  const number = currentStageNumber();
  const stage = stages.find((item) => item.number === number);
  if (typeof currentCleanup === "function") {
    currentCleanup();
  }
  drawNav(number);
  markVisited(number);
  if (!context.state) {
    await context.refreshState();
  }
  view.replaceChildren();
  currentCleanup = stage.mount(view, context);
  window.scrollTo({ top: 0 });
}

async function start() {
  try {
    context.info = await api.info();
    modeBadge.textContent = context.info.mode === "starter" ? "starter code (students)" : "complete code";
    modeBadge.className = `mode-badge ${context.info.mode}`;
    setOnline(true);
  } catch (error) {
    setOnline(false);
  }
  await context.refreshState();
  window.addEventListener("hashchange", showStage);
  showStage();
}

document.getElementById("reset-button").addEventListener("click", async () => {
  const result = await context.run(() => api.reset());
  if (result) {
    toast("Opening-night data restored");
    showStage();
  }
});

start();
