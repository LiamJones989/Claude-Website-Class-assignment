const MENU = {
  morning: { title: "Morning", note: "Bread comes out of the oven at six. Coffee is roasted weekly, ten minutes down the road.", items: [
    ["Cardamom bun", "Laminated dough, brown butter, a crust of sugar. Gone by nine most days.", "4.50"],
    ["Soft egg toast", "Sourdough, whipped ricotta, chive oil, a six-minute egg.", "11"],
    ["Oat porridge", "Slow-cooked, with roasted plums and toasted seeds.", "9"],
    ["Flat white", "Two shots, steamed milk, no fuss.", "4.25"],
    ["Blood orange spritz", "Fresh juice and sparkling water. No alcohol, all fizz.", "5.50"]] },
  afternoon: { title: "Afternoon", note: "Lunch plates are made to be shared, or not. We won't judge.", items: [
    ["Charred leek tart", "Crisp pastry, goat curd, hazelnuts, honey.", "13"],
    ["Chicken and pickles", "Roast thigh on grilled flatbread with quick-pickled vegetables.", "16"],
    ["Chickpea stew", "Tomato, preserved lemon, yogurt, soft herbs, bread to mop.", "14"],
    ["Lemon olive oil cake", "Served plain, because it doesn't need anything else.", "6"],
    ["Iced hojicha", "Roasted green tea over ice, lightly sweet.", "4.75"]] },
  evening: { title: "Evening", note: "Lamps on at four. Small dishes arrive when they're ready, not all at once.", items: [
    ["Burrata and figs", "Warm figs, thyme, black pepper, grilled bread.", "15"],
    ["Mussels in cider", "Fennel, garlic, cream, and a lot of bread.", "18"],
    ["Mushroom dumplings", "Pan-fried, with chili crisp and black vinegar.", "14"],
    ["Glass of something orange", "Ask us. The list changes every few weeks.", "11"],
    ["Burnt honey ice cream", "Sea salt, olive oil, one spoon or two.", "8"]] }
};

const $ = s => document.querySelector(s);
const tabs = [...document.querySelectorAll('[role="tab"]')];

function show(time) {
  const m = MENU[time];
  document.body.dataset.time = time;
  $("#menu-title").textContent = m.title;
  $("#menu-note").textContent = m.note;
  const list = $("#items");
  list.innerHTML = "";
  for (const [name, desc, price] of m.items) {
    const li = document.createElement("li");
    li.innerHTML = "<h3></h3><span class='price'></span><p></p>";
    li.querySelector("h3").textContent = name;
    li.querySelector(".price").textContent = price;
    li.querySelector("p").textContent = desc;
    list.append(li);
  }
  tabs.forEach(t => t.setAttribute("aria-selected", String(t.dataset.time === time)));
}
tabs.forEach((t, i) => {
  t.addEventListener("click", () => show(t.dataset.time));
  t.addEventListener("keydown", e => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const n = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
    n.focus(); show(n.dataset.time);
  });
});

// Start on the visitor's real time of day
const now = new Date(), h = now.getHours();
show(h < 11 ? "morning" : h < 16 ? "afternoon" : "evening");

// Open / closed status (Tue–Sun, 7 am to 11 pm)
(function () {
  const el = $("#status"), day = now.getDay(), open = day !== 1 && h >= 7 && h < 23;
  el.classList.toggle("closed", !open);
  el.textContent = open
    ? (h < 11 ? "Open now, serving breakfast" : h < 16 ? "Open now, serving lunch plates" : "Open now, wine and small dishes")
    : (day === 1 ? "Closed today, back Tuesday at 7 am" : "Closed, opens again at 7 am");
})();

// Marquee
$("#track").innerHTML = Array(2).fill(
  "<span>" + ["Cardamom buns", "Soft eggs", "Mussels in cider", "Orange wine", "Burnt honey ice cream", "Iced hojicha", "Olive oil cake"]
    .map(t => t + "<i></i>").join("") + "</span>"
).join("");

// The sun leans slightly toward the cursor
if (matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) {
  addEventListener("pointermove", e => {
    const w = document.querySelector(".disc-wrap").style;
    w.setProperty("--mx", ((e.clientX / innerWidth - .5) * -30) + "px");
    w.setProperty("--my", ((e.clientY / innerHeight - .5) * -30) + "px");
  });
}

// Reservation dialog
const dlg = $("#reserve"), form = $("#rform"), conf = $("#confirm");
$("#date").min = now.toISOString().slice(0, 10);
document.querySelectorAll("[data-reserve]").forEach(b => b.addEventListener("click", () => { conf.hidden = true; dlg.showModal(); }));
$("#close").addEventListener("click", () => dlg.close());
dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
form.addEventListener("submit", e => {
  e.preventDefault();
  const d = new FormData(form);
  conf.textContent = `Thanks, ${d.get("name")}. We've noted a table for ${d.get("guests")} on ${d.get("date")} at ${d.get("time")}. A confirmation will follow by email.`;
  conf.hidden = false;
  $("#send").textContent = "Update request";
});

/* ---------- Extras ---------- */

// Toast
let toastTimer;
function toast(message) {
  const t = $("#toast");
  t.textContent = message;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 3200);
}

// Scroll progress bar
const bar = $("#progress");
function updateProgress() {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
}
addEventListener("scroll", updateProgress, { passive: true });
addEventListener("resize", updateProgress);
updateProgress();

// Mobile menu
const burger = $("#burger"), sheet = $("#sheet");
function setMenu(open) {
  document.body.classList.toggle("menu-open", open);
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  sheet.setAttribute("aria-hidden", String(!open));
}
burger.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
sheet.addEventListener("click", e => { if (e.target.closest("a, button")) setMenu(false); });
addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

// Menu filter (vegetarian)
const NON_VEG = new Set(["Chicken and pickles", "Mussels in cider"]);
let filter = "all";
function applyFilter() {
  document.querySelectorAll("#items li").forEach(li => {
    li.hidden = filter === "veg" && NON_VEG.has(li.querySelector("h3").textContent);
  });
}
document.querySelectorAll("#chips button").forEach(b => b.addEventListener("click", () => {
  filter = b.dataset.f;
  document.querySelectorAll("#chips button").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
  applyFilter();
}));

// Extend show() so the slider, tab title and filter stay in sync
const baseShow = show;
show = function (time) {
  baseShow(time);
  $("#scrub").value = Object.keys(MENU).indexOf(time);
  $("#scrub-out").textContent = MENU[time].title;
  document.title = `pale hour, ${MENU[time].title.toLowerCase()}`;
  applyFilter();
};
$("#scrub").addEventListener("input", e => show(Object.keys(MENU)[+e.target.value]));
show(document.body.dataset.time);

// Keyboard shortcuts: 1, 2, 3 jump between times of day
addEventListener("keydown", e => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (/^(INPUT|SELECT|TEXTAREA)$/.test(document.activeElement.tagName)) return;
  const key = Object.keys(MENU)[Number(e.key) - 1];
  if (key) show(key);
});

// Newsletter
$("#nform").addEventListener("submit", e => {
  e.preventDefault();
  const input = $("#nemail"), msg = $("#nmsg");
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
  msg.classList.toggle("err", !ok);
  if (!ok) {
    msg.textContent = "That email doesn't look right. Check it and try again.";
    input.focus();
    return;
  }
  msg.textContent = `Subscribed. The next bake note goes to ${input.value.trim()}.`;
  toast("You're on the list");
  input.value = "";
});

// Confirm reservations with a toast too
$("#rform").addEventListener("submit", () => toast("Table request saved"));
