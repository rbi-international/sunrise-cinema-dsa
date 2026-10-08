// player.js
// Replays an algorithm one step at a time.
// A stage turns the server's step trace into a list of "frames". Each frame is a plain object:
//   { caption: "what happens now", checks: 3, moves: 1, ...anything the stage needs to draw }
// The player shows one frame at a time and calls draw(frame) to paint it.

import { el } from "./ui.js";

export class Player {
  constructor(draw) {
    this.draw = draw;
    this.frames = [];
    this.position = 0;
    this.timer = null;
    this.delay = 650;

    this.captionNode = el("div", { class: "step-caption" });
    this.checksNode = el("b", {}, "0");
    this.movesNode = el("b", {}, "0");
    this.stepNode = el("span", { class: "speed-label" }, "");
    this.playButton = el("button", { type: "button", class: "button", onclick: () => this.toggle() }, "Play");

    const speed = el("input", { type: "range", min: "80", max: "1400", step: "20", value: String(1480 - this.delay), "aria-label": "Speed" });
    speed.addEventListener("input", () => {
      this.delay = 1480 - Number(speed.value);
    });

    this.node = el("div", {},
      el("div", { class: "player" },
        el("button", { type: "button", class: "button ghost", onclick: () => this.goTo(0), title: "Back to start" }, "⏮"),
        el("button", { type: "button", class: "button ghost", onclick: () => this.goTo(this.position - 1), title: "One step back" }, "◀"),
        this.playButton,
        el("button", { type: "button", class: "button ghost", onclick: () => this.goTo(this.position + 1), title: "One step forward" }, "▶"),
        el("button", { type: "button", class: "button ghost", onclick: () => this.goTo(this.frames.length - 1), title: "Jump to the end" }, "⏭"),
        el("span", { class: "speed-label" }, "slow"),
        speed,
        el("span", { class: "speed-label" }, "fast"),
        this.stepNode,
        el("div", { class: "counters" },
          el("span", { class: "counter" }, "checks ", this.checksNode),
          el("span", { class: "counter" }, "moves ", this.movesNode),
        ),
      ),
      this.captionNode,
    );
  }

  load(frames, autoplay = true) {
    this.stop();
    this.frames = frames.length > 0 ? frames : [{ caption: "", checks: 0, moves: 0 }];
    this.goTo(0);
    if (autoplay && this.frames.length > 1) {
      this.play();
    }
  }

  goTo(index) {
    if (this.frames.length === 0) {
      return;
    }
    this.position = Math.max(0, Math.min(index, this.frames.length - 1));
    const frame = this.frames[this.position];
    this.captionNode.textContent = frame.caption || "";
    this.checksNode.textContent = frame.checks ?? 0;
    this.movesNode.textContent = frame.moves ?? 0;
    this.stepNode.textContent = `step ${this.position + 1} of ${this.frames.length}`;
    this.draw(frame);
    if (this.position === this.frames.length - 1) {
      this.stop();
    }
  }

  play() {
    if (this.position >= this.frames.length - 1) {
      this.goTo(0);
    }
    this.stop();
    this.playButton.textContent = "Pause";
    const tick = () => {
      if (this.position >= this.frames.length - 1) {
        this.stop();
        return;
      }
      this.goTo(this.position + 1);
      this.timer = setTimeout(tick, this.delay);
    };
    this.timer = setTimeout(tick, this.delay);
  }

  stop() {
    clearTimeout(this.timer);
    this.timer = null;
    this.playButton.textContent = "Play";
  }

  toggle() {
    if (this.timer) {
      this.stop();
    } else {
      this.play();
    }
  }
}
