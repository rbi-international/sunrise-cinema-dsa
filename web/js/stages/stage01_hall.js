// Stage 1: the hall. Basic terminology, data organization, ADT. No C++ call: this stage is talk and pictures.

import { el, stageHeader, block, takeaway, limitation, flow, button, toast } from "../ui.js";

const TERMS = [
  { key: "item", term: "Data item", cinema: "one seat: booked or free", meaning: "The smallest value we store: 1 or 0.", tint: "amber" },
  { key: "record", term: "Record", cinema: "one ticket: ID, name, seat", meaning: "A group of related data items about one thing.", tint: "rose" },
  { key: "row", term: "Linear structure (1D array)", cinema: "a row of 10 seats", meaning: "Items one after another, each with a position number.", tint: "mint" },
  { key: "hall", term: "2D array", cinema: "the hall of 5 rows", meaning: "Items in rows and columns.", tint: "blue" },
  { key: "ops", term: "Operations", cinema: "show, book, cancel, find, sort, combine", meaning: "Traversal, update, insertion, deletion, searching, sorting, merging.", tint: "lavender" },
  { key: "adt", term: "Abstract Data Type", cinema: "the booking desk", meaning: "What operations exist, hiding how they are done inside.", tint: "grey" },
];

export default {
  number: 1,
  title: "The hall",
  navTitle: "The hall",
  subtitle: "Name every part of the cinema before writing any code",
  topic: "Basic terminology · data organization · ADT",
  story: "Opening night. The 7 PM show is sold out, and at 6 PM the booking software crashed. We rebuild it, piece by piece, before the show starts.",

  mount(container) {
    let active = null;
    const picture = el("div");
    const ticket = el("div");

    function drawPicture() {
      const rows = [];
      for (let r = 0; r < 5; r++) {
        const seats = [];
        for (let c = 0; c < 10; c++) {
          const on = active === "item" ? r === 2 && c === 3 : active === "row" ? r === 2 : false;
          seats.push(el("span", { class: `mini-seat ${on ? "on" : ""}` }));
        }
        rows.push(el("div", { class: `mini-row ${active === "row" && r === 2 ? "on" : ""}` }, seats));
      }
      picture.replaceChildren(
        el("div", { class: `hall-picture ${active === "hall" ? "on" : ""}` },
          el("div", { class: "screen" }),
          el("div", { class: "screen-label" }, "SCREEN"),
          rows,
        ),
      );
      ticket.replaceChildren(active === "record"
        ? el("div", { class: "panel tint-rose", style: { maxWidth: "260px", marginTop: "10px" } },
            el("h4", {}, "Ticket (a record)"),
            el("div", { class: "chips" },
              el("span", { class: "chip" }, "ID 1047"),
              el("span", { class: "chip" }, "Simran"),
              el("span", { class: "chip" }, "Row 2, Seat 3"),
            ))
        : active === "ops" || active === "adt"
          ? el("div", { class: "panel tint-lavender", style: { maxWidth: "420px", marginTop: "10px" } },
              el("h4", {}, active === "adt" ? "Booking desk (what you can ask, not how)" : "Operations"),
              el("div", { class: "chips" }, ["show", "book", "cancel", "find free", "find ticket", "sort", "combine lists"].map((op) => el("span", { class: "chip" }, op))))
          : "");
    }

    const cards = el("div", { class: "term-grid" });
    function drawCards() {
      cards.replaceChildren(...TERMS.map((item) =>
        el("button", {
          type: "button",
          class: `term-card tint-${item.tint} ${active === item.key ? "active" : ""}`,
          onclick: () => {
            active = active === item.key ? null : item.key;
            drawCards();
            drawPicture();
          },
        },
          el("div", { class: "term" }, item.term),
          el("div", { class: "cinema" }, item.cinema),
          el("div", { class: "meaning" }, item.meaning),
        ),
      ));
    }

    const pollResult = el("p", { class: "real-terms" });
    function answer(choice) {
      pollResult.textContent = choice === "same"
        ? "Most of the class says this. Keep the answer: Stage 4 measures it."
        : choice === "jump"
          ? "Right instinct. Stage 2 shows why: the seat number tells the computer exactly where to go."
          : "Interesting. Stage 4 counts the steps, so we will know for sure.";
      toast("Answer noted. We check it in Stage 4.");
    }

    drawCards();
    drawPicture();

    container.append(
      stageHeader(this),
      block("Click a word to see which part of the cinema it means",
        el("div", { style: { display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "flex-start" } },
          el("div", {}, picture, ticket),
        ),
        cards,
      ),
      block("From the cinema to the textbook",
        flow([
          { title: "What we see", tint: "grey", chips: ["seat", "row", "hall", "ticket"], caption: "cinema words" },
          { title: "How we arrange it", tint: "amber", chips: ["data item", "1D array", "2D array", "record"], caption: "data organization" },
          { title: "What we can do", tint: "mint", chips: ["traverse", "insert", "delete", "search", "sort", "merge"], caption: "operations" },
        ]),
        el("p", { class: "real-terms" },
          el("strong", {}, "Linear vs non-linear: "),
          "seats in a row are linear (one after another). A family tree of customers would be non-linear (it branches). Trees and graphs come in later units."),
        takeaway("Every arrangement makes some jobs cheap and some jobs costly.", "Today we find out which, one stage at a time."),
        limitation("An ADT tells you what the desk can do, not how fast. Speed depends on the arrangement underneath."),
      ),
      block("Quick poll: predict before we measure",
        el("div", { class: "poll" },
          el("div", {}, "Which is faster for the desk: going straight to seat 7, or finding the first empty seat?"),
          el("div", { class: "poll-options" },
            button("About the same", () => answer("same"), "ghost"),
            button("Going to seat 7", () => answer("jump"), "ghost"),
            button("Finding an empty seat", () => answer("find"), "ghost"),
          ),
          pollResult,
        ),
      ),
    );
  },
};
