
const MENU = {
  morning: {
    title: "Morning",
    note: "Bread comes out of the oven at six. Coffee is roasted weekly, ten minutes down the road.",
    items: [
      ["Cardamom bun", "Laminated dough, brown butter, a crust of sugar. Gone by nine most days.", "4.50"],
      ["Soft egg toast", "Sourdough, whipped ricotta, chive oil, a six-minute egg.", "11"],
      ["Oat porridge", "Slow-cooked, with roasted plums and toasted seeds.", "9"],
      ["Flat white", "Two shots, steamed milk, no fuss.", "4.25"],
      ["Blood orange spritz", "Fresh juice and sparkling water. No alcohol, all fizz.", "5.50"]
    ]
  },
  afternoon: {
    title: "Afternoon",
    note: "Lunch plates are made to be shared, or not. We won't judge.",
    items: [
      ["Charred leek tart", "Crisp pastry, goat curd, hazelnuts, honey.", "13"],
      ["Chicken and pickles", "Roast thigh on grilled flatbread with quick-pickled vegetables.", "16"],
      ["Chickpea stew", "Tomato, preserved lemon, yogurt, soft herbs, bread to mop.", "14"],
      ["Lemon olive oil cake", "Served plain, because it doesn't need anything else.", "6"],
      ["Iced hojicha", "Roasted green tea over ice, lightly sweet.", "4.75"]
    ]
  },
  evening: {
    title: "Evening",
    note: "Lamps on at four. Small dishes arrive when they're ready, not all at once.",
    items: [
      ["Burrata and figs", "Warm figs, thyme, black pepper, grilled bread.", "15"],
      ["Mussels in cider", "Fennel, garlic, cream, and a lot of bread.", "18"],
      ["Mushroom dumplings", "Pan-fried, with chili crisp and black vinegar.", "14"],
      ["Glass of something orange", "Ask us. The list changes every few weeks.", "11"],
      ["Burnt honey ice cream", "Sea salt, olive oil, one spoon or two.", "8"]
    ]
  }
};

const body = document.body;
const tabs = [...document.querySelectorAll('[role="tab"]')];
const list = document.getElementById("items");
const title = document.getElementById("menu-title");
const note = document.getElementById("menu-note");

function show(time) {
  const m = MENU[time];
  body.dataset.time = time;
  title.textContent = m.title;
  note.textContent = m.note;
  list.innerHTML = "";
  for (const [name, desc, price] of m.items) {
    const li = document.createElement("li");
    li.innerHTML = `<h3></h3><span class="price"></span><p></p>`;
    li.querySelector("h3").textContent = name;
    li.querySelector(".price").textContent = price;
    li.querySelector("p").textContent = desc;
    list.appendChild(li);
  }
  tabs.forEach(t => t.setAttribute("aria-selected", String(t.dataset.time === time)));
}

tabs.forEach(t => t.addEventListener("click", () => show(t.dataset.time)));

// Arrow keys move between tabs
tabs.forEach((t, i) => t.addEventListener("keydown", e => {
  if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
  const next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
  next.focus();
  show(next.dataset.time);
}));

// Start with whatever matches the visitor's actual time of day
const h = new Date().getHours();
show(h < 11 ? "morning" : h < 16 ? "afternoon" : "evening");
