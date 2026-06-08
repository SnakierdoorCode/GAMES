const world = document.querySelector("#world");
const stage = document.querySelector("#stage");
const rulesBox = document.querySelector("#rules");
const inspector = document.querySelector("#inspector");
const hand = document.querySelector("#hand");
const toast = document.querySelector("#toast");
const levelText = document.querySelector("#levelText");
const savedCounter = document.querySelector("#savedCounter");
const savedLabel = document.querySelector("#savedLabel");
const saveMeterFill = document.querySelector("#saveMeterFill");
const ruleBudget = document.querySelector("#ruleBudget");
const solveBtn = document.querySelector("#solveBtn");
const resetBtn = document.querySelector("#resetBtn");
const muteBtn = document.querySelector("#muteBtn");
const editorToggle = document.querySelector("#editorToggle");
const editorTools = document.querySelector("#editorTools");
const playCustomBtn = document.querySelector("#playCustomBtn");
const clearCustomBtn = document.querySelector("#clearCustomBtn");

const W = 960;
const H = 540;
const GRAVITY = 0.42;
const FRICTION = 0.82;
const STEP_HEIGHT = 42;

const rules = [
  ["gravity", "Gravity", "G", "falls down", "#ffe27a"],
  ["solid", "Solid", "S", "blocks movement", "#dbf0ff"],
  ["sticky", "Sticky", "~", "sticks and slows", "#ffd1e1"],
  ["bouncy", "Bouncy", "B", "springs upward", "#c8f7b8"],
  ["alive", "Alive", "A", "walks by itself", "#f5d0ff"],
  ["sharp", "Sharp", "X", "dangerous", "#ffb2a6"],
  ["magnetic", "Magnetic", "U", "pulls things", "#ccd3ff"],
  ["heavy", "Heavy", "H", "weighs more", "#d6d1c8"],
  ["floating", "Floating", "F", "floats upward", "#b8fff1"],
  ["burning", "Burning", "*", "breaks fragile", "#ffc07a"],
  ["fragile", "Fragile", "!", "can break", "#fff7a6"],
];

const ruleMap = Object.fromEntries(rules.map((rule) => [rule[0], rule]));

const levels = [
  {
    name: "Level 1: Water Does Not Know It Is a Bridge",
    tip: "Give the water Solid, and give the stone Floating if it blocks the way.",
    spawn: [{ x: 50, y: 425 }, { x: 82, y: 425 }],
    exit: { x: 860, y: 383 },
    objects: [
      obj("floor", "platform", 0, 500, 960, 40, ["solid"]),
      obj("bankL", "platform", 0, 455, 300, 45, ["solid"]),
      obj("bankR", "platform", 640, 455, 320, 45, ["solid"]),
      obj("water", "water", 315, 463, 305, 34, []),
      obj("stone", "stone", 410, 370, 68, 62, ["solid", "gravity", "heavy"]),
      obj("wall", "wall", 710, 396, 40, 104, ["solid"]),
    ],
  },
  {
    name: "Level 2: The Box Dreams of Life",
    tip: "Give the blue bridge Solid, and make the enemy Sticky or remove Sharp.",
    spawn: [{ x: 40, y: 425 }, { x: 72, y: 425 }, { x: 104, y: 425 }],
    exit: { x: 850, y: 383 },
    objects: [
      obj("floor", "platform", 0, 500, 960, 40, ["solid"]),
      obj("pitL", "platform", 0, 455, 250, 45, ["solid"]),
      obj("pitR", "platform", 520, 455, 440, 45, ["solid"]),
      obj("mistBridge", "water", 250, 463, 270, 34, []),
      obj("crate", "crate", 330, 407, 58, 58, ["gravity"]),
      obj("enemy", "enemy", 735, 447, 52, 52, ["solid", "alive", "sharp"]),
      obj("ceiling", "platform", 350, 310, 180, 24, []),
    ],
  },
  {
    name: "Level 3: Doors Are Not Forever",
    tip: "Fragile plus Burning can break doors. Bouncy can save you from a pit.",
    spawn: [{ x: 50, y: 425 }, { x: 84, y: 425 }],
    exit: { x: 870, y: 383 },
    objects: [
      obj("floor", "platform", 0, 500, 960, 40, ["solid"]),
      obj("left", "platform", 0, 455, 330, 45, ["solid"]),
      obj("right", "platform", 600, 455, 360, 45, ["solid"]),
      obj("springStone", "stone", 395, 438, 64, 62, ["solid", "gravity"]),
      obj("door", "wall", 765, 395, 42, 105, ["solid"]),
      obj("fireBox", "crate", 686, 430, 55, 55, ["solid", "gravity", "burning"]),
    ],
  },
  {
    name: "Level 4: Ghost Bridge",
    tip: "Make the blue bridge Solid and remove Sharp from the enemy.",
    spawn: [{ x: 45, y: 425 }, { x: 78, y: 425 }],
    exit: { x: 850, y: 383 },
    objects: [
      obj("floor", "platform", 0, 500, 960, 40, ["solid"]),
      obj("left4", "platform", 0, 455, 230, 45, ["solid"]),
      obj("bridge4", "water", 230, 463, 390, 34, []),
      obj("right4", "platform", 620, 455, 340, 45, ["solid"]),
      obj("enemy4", "enemy", 705, 447, 52, 52, ["solid", "sharp"]),
    ],
  },
  {
    name: "Level 5: The Stone Thinks It Is a Bird",
    tip: "The stone blocks the road. Remove Solid or give it Floating.",
    spawn: [{ x: 50, y: 425 }, { x: 86, y: 425 }, { x: 122, y: 425 }],
    exit: { x: 860, y: 383 },
    objects: [
      obj("floor", "platform", 0, 500, 960, 40, ["solid"]),
      obj("road5", "platform", 0, 455, 960, 45, ["solid"]),
      obj("stone5", "stone", 430, 394, 72, 72, ["solid", "gravity", "heavy"]),
    ],
  },
  {
    name: "Level 6: Sticky Guard",
    tip: "The enemy near the door must become Sticky and not Sharp.",
    spawn: [{ x: 45, y: 425 }, { x: 78, y: 425 }],
    exit: { x: 850, y: 383 },
    objects: [
      obj("floor", "platform", 0, 500, 960, 40, ["solid"]),
      obj("road6", "platform", 0, 455, 960, 45, ["solid"]),
      obj("enemy6", "enemy", 680, 447, 52, 52, ["solid", "alive", "sharp"]),
      obj("lowWall6", "wall", 755, 420, 34, 80, ["solid"]),
    ],
  },
  {
    name: "Level 7: Water Forgot How to Be Water",
    tip: "Both water gaps must become Solid.",
    spawn: [{ x: 45, y: 425 }, { x: 78, y: 425 }, { x: 111, y: 425 }],
    exit: { x: 860, y: 383 },
    objects: [
      obj("floor", "platform", 0, 500, 960, 40, ["solid"]),
      obj("island7a", "platform", 0, 455, 190, 45, ["solid"]),
      obj("water7a", "water", 190, 463, 230, 34, []),
      obj("island7b", "platform", 420, 455, 170, 45, ["solid"]),
      obj("water7b", "water", 590, 463, 210, 34, []),
      obj("island7c", "platform", 800, 455, 160, 45, ["solid"]),
    ],
  },
  {
    name: "Level 8: Phantom Doors",
    tip: "The walls before the door must not be Solid.",
    spawn: [{ x: 50, y: 425 }, { x: 84, y: 425 }],
    exit: { x: 850, y: 383 },
    objects: [
      obj("floor", "platform", 0, 500, 960, 40, ["solid"]),
      obj("road8", "platform", 0, 455, 960, 45, ["solid"]),
      obj("wall8a", "wall", 545, 410, 38, 90, ["solid"]),
      obj("wall8b", "wall", 650, 410, 38, 90, ["solid"]),
      obj("wall8c", "wall", 755, 410, 38, 90, ["solid"]),
    ],
  },
  {
    name: "Level 9: Magnetic Puddle",
    tip: "Make the bridge Solid and clear the dangerous stuff from the road.",
    spawn: [{ x: 45, y: 425 }, { x: 78, y: 425 }],
    exit: { x: 855, y: 383 },
    objects: [
      obj("floor", "platform", 0, 500, 960, 40, ["solid"]),
      obj("left9", "platform", 0, 455, 260, 45, ["solid"]),
      obj("water9", "water", 260, 463, 360, 34, ["magnetic"]),
      obj("right9", "platform", 620, 455, 340, 45, ["solid"]),
      obj("stone9", "stone", 520, 390, 70, 70, ["solid", "gravity", "heavy"]),
      obj("enemy9", "enemy", 700, 447, 52, 52, ["solid", "sharp"]),
    ],
  },
  {
    name: "Level 10: First Handmade Trial",
    tip: "Bridges Solid, walls not Solid, enemy not Sharp.",
    spawn: [{ x: 38, y: 425 }, { x: 70, y: 425 }, { x: 102, y: 425 }, { x: 134, y: 425 }],
    exit: { x: 860, y: 383 },
    objects: [
      obj("floor", "platform", 0, 500, 960, 40, ["solid"]),
      obj("left10", "platform", 0, 455, 220, 45, ["solid"]),
      obj("water10", "water", 220, 463, 300, 34, []),
      obj("mid10", "platform", 520, 455, 170, 45, ["solid"]),
      obj("water10b", "water", 690, 463, 120, 34, []),
      obj("right10", "platform", 810, 455, 150, 45, ["solid"]),
      obj("wall10", "wall", 610, 405, 36, 95, ["solid"]),
      obj("enemy10", "enemy", 735, 447, 52, 52, ["solid", "sharp"]),
      obj("stone10", "stone", 390, 394, 70, 70, ["solid", "gravity", "heavy"]),
    ],
  },
];

levels.push(...makeGeneratedLevels(11, 100));

let levelIndex = 0;
let entities = [];
let creatures = [];
let dragging = null;
let dragGhost = null;
let audioCtx = null;
let muted = false;
let lastTime = performance.now();
let won = false;
let rulesLeft = 0;
let editorMode = false;
let editorTool = "platform";
let customLevel = makeEmptyCustomLevel();
let currentLevel = null;
let stageScale = 1;
let stageOffsetX = 0;
let stageOffsetY = 0;
let selectedRule = null;
let dragStartX = 0;
let dragStartY = 0;

function obj(id, type, x, y, w, h, ruleList) {
  return { id, type, x, y, w, h, vx: 0, vy: 0, rules: [...ruleList], broken: false, aliveDir: 1 };
}

function makeGeneratedLevels(from, to) {
  const generated = [];
  for (let n = from; n <= to; n++) generated.push(makeGeneratedLevel(n));
  return generated;
}

function makeGeneratedLevel(n) {
  const pattern = n % 4;
  const creatureCount = 2 + (n % 3);
  const spawn = Array.from({ length: creatureCount }, (_, i) => ({ x: 42 + i * 32, y: 425 }));
  const exit = { x: 850 + (n % 2) * 10, y: 383 };
  const objects = [
    obj(`floor${n}`, "platform", 0, 500, 960, 40, ["solid"]),
  ];

  if (pattern === 0) {
    objects.push(
      obj(`left${n}`, "platform", 0, 455, 240, 45, ["solid"]),
      obj(`bridge${n}`, "water", 240, 463, 360, 34, n % 8 === 0 ? ["magnetic"] : []),
      obj(`right${n}`, "platform", 600, 455, 360, 45, ["solid"]),
      obj(`wall${n}`, "wall", 710, 405, 36, 95, ["solid"]),
      obj(`enemy${n}`, "enemy", 790, 447, 52, 52, ["solid", "sharp"])
    );
  } else if (pattern === 1) {
    objects.push(
      obj(`island${n}a`, "platform", 0, 455, 185, 45, ["solid"]),
      obj(`water${n}a`, "water", 185, 463, 225, 34, []),
      obj(`island${n}b`, "platform", 410, 455, 170, 45, ["solid"]),
      obj(`water${n}b`, "water", 580, 463, 225, 34, []),
      obj(`island${n}c`, "platform", 805, 455, 155, 45, ["solid"]),
      obj(`stone${n}`, "stone", 455, 390, 68, 68, ["solid", "gravity", "heavy"])
    );
  } else if (pattern === 2) {
    objects.push(
      obj(`road${n}`, "platform", 0, 455, 960, 45, ["solid"]),
      obj(`wall${n}a`, "wall", 420, 410, 34, 90, ["solid"]),
      obj(`wall${n}b`, "wall", 590, 410, 34, 90, ["solid"]),
      obj(`enemy${n}`, "enemy", 700, 447, 52, 52, n % 6 === 0 ? ["solid", "alive", "sharp"] : ["solid", "sharp"])
    );
  } else {
    objects.push(
      obj(`left${n}`, "platform", 0, 455, 280, 45, ["solid"]),
      obj(`water${n}`, "water", 280, 463, 280, 34, []),
      obj(`right${n}`, "platform", 560, 455, 400, 45, ["solid"]),
      obj(`stone${n}a`, "stone", 350, 392, 70, 70, ["solid", "gravity", "heavy"]),
      obj(`enemy${n}`, "enemy", 720, 447, 52, 52, ["solid", "sharp"]),
      obj(`crate${n}`, "crate", 635, 410, 56, 56, n % 5 === 0 ? ["solid", "gravity"] : ["gravity"])
    );
  }

  return {
    name: `Level ${n}: ${generatedLevelTitle(n)}`,
    tip: generatedLevelTip(pattern),
    spawn,
    exit,
    objects,
  };
}

function generatedLevelTitle(n) {
  const titles = [
    "Rule Garden",
    "Paper World",
    "Little Laws",
    "Wrong Physics",
    "Scribble Pilgrimage",
    "Bridge Ritual",
    "Soft Reality",
    "The Door Test",
    "Floating Thoughts",
    "God's Notebook",
  ];
  return titles[n % titles.length];
}

function generatedLevelTip(pattern) {
  const tips = [
    "Make water Solid, remove Solid from walls, and make enemies safe.",
    "Turn both water gaps Solid and float or ghost any blocking stones.",
    "Remove Solid from walls and remove Sharp from enemies.",
    "Make the water Solid, float stones, and make enemies not Sharp.",
  ];
  return tips[pattern];
}

function makeEmptyCustomLevel() {
  return {
    name: "Custom Level",
    tip: "Editor level: place objects, then press Play.",
    budget: 12,
    spawn: [{ x: 45, y: 425 }, { x: 78, y: 425 }],
    exit: { x: 850, y: 383 },
    objects: [
      obj("customFloor", "platform", 0, 500, 960, 40, ["solid"]),
      obj("customRoad", "platform", 0, 455, 260, 45, ["solid"]),
    ],
  };
}

function ruleBudgetFor(level) {
  if (Number.isFinite(level.budget)) return level.budget;
  const water = level.objects.filter((item) => item.type === "water").length;
  const walls = level.objects.filter((item) => item.type === "wall").length;
  const enemies = level.objects.filter((item) => item.type === "enemy").length;
  const stones = level.objects.filter((item) => item.type === "stone").length;
  return Math.max(3, Math.min(12, water + walls + enemies + stones + 2));
}

function setupRules() {
  rulesBox.innerHTML = "";
  rules.forEach(([key, name, icon, desc, color], i) => {
    const el = document.createElement("div");
    el.className = "rule";
    el.draggable = false;
    el.dataset.rule = key;
    el.style.setProperty("--note", color);
    el.style.setProperty("--tilt", `${i % 2 ? 1.2 : -1.4}deg`);
    el.innerHTML = `<span class="rule-icon">${icon}</span><span>${name}<small>${desc}</small></span>`;
    el.addEventListener("dragstart", (event) => {
      dragging = key;
      event.dataTransfer.setData("text/plain", key);
      event.dataTransfer.effectAllowed = "copy";
      blip(260, 0.04, "triangle");
    });
    el.addEventListener("pointerdown", (event) => startPointerDrag(event, key, name));
    el.addEventListener("click", () => {
      if (!dragging) selectRule(key);
    });
    rulesBox.appendChild(el);
  });
}

function startPointerDrag(event, key, name) {
  if (event.pointerType === "touch") return;
  event.preventDefault();
  dragging = key;
  dragStartX = event.clientX;
  dragStartY = event.clientY;
  dragGhost = document.createElement("div");
  dragGhost.className = "drag-ghost";
  dragGhost.textContent = name;
  document.body.appendChild(dragGhost);
  moveGhost(event.clientX, event.clientY);
  window.addEventListener("pointermove", pointerMove);
  window.addEventListener("pointerup", pointerUp, { once: true });
}

function pointerMove(event) {
  moveGhost(event.clientX, event.clientY);
  targetFromPoint(event.clientX, event.clientY);
}

function pointerUp(event) {
  const target = targetFromPoint(event.clientX, event.clientY);
  const moved = Math.hypot(event.clientX - dragStartX, event.clientY - dragStartY);
  if (target && dragging) {
    if (target.classList.contains("creature")) applyCreatureRule(target.dataset.id, dragging);
    else applyRule(target.dataset.id, dragging);
    clearSelectedRule();
  } else if (dragging && moved < 10) {
    selectRule(dragging);
  }
  clearDrag();
}

function moveGhost(x, y) {
  if (!dragGhost) return;
  dragGhost.style.left = `${x + 12}px`;
  dragGhost.style.top = `${y + 12}px`;
}

function clearDrag() {
  dragging = null;
  document.querySelectorAll(".targeted").forEach((el) => el.classList.remove("targeted"));
  if (dragGhost) dragGhost.remove();
  dragGhost = null;
  window.removeEventListener("pointermove", pointerMove);
}

function selectRule(rule) {
  selectedRule = rule;
  rulesBox.querySelectorAll(".rule").forEach((button) => {
    button.classList.toggle("selected", button.dataset.rule === rule);
  });
  toastMessage(`Selected ${ruleMap[rule][1]}. Tap an object to attach it.`);
  blip(320, 0.05, "triangle");
}

function clearSelectedRule() {
  selectedRule = null;
  rulesBox.querySelectorAll(".rule.selected").forEach((button) => button.classList.remove("selected"));
}

function updateStageLayout() {
  const scale = Math.min(world.clientWidth / W, world.clientHeight / H);
  stageScale = Number.isFinite(scale) && scale > 0 ? scale : 1;
  stageOffsetX = (world.clientWidth - W * stageScale) / 2;
  stageOffsetY = (world.clientHeight - H * stageScale) / 2;
  stage.style.transform = `translate(${stageOffsetX}px, ${stageOffsetY}px) scale(${stageScale})`;
}

function clientToGame(clientX, clientY) {
  const rect = world.getBoundingClientRect();
  return {
    x: clamp((clientX - rect.left - stageOffsetX) / stageScale, 0, W),
    y: clamp((clientY - rect.top - stageOffsetY) / stageScale, 0, H),
  };
}

function targetFromPoint(x, y) {
  document.querySelectorAll(".targeted").forEach((el) => el.classList.remove("targeted"));
  const found = document.elementsFromPoint(x, y).find((el) => el.classList?.contains("entity") || el.classList?.contains("creature"));
  if (found) found.classList.add("targeted");
  return found;
}

function loadLevel(index) {
  levelIndex = index % levels.length;
  const level = levels[levelIndex];
  currentLevel = level;
  entities = level.objects.map((item) => structuredClone(item));
  creatures = level.spawn.map((spot, i) => ({
    id: `c${i}`,
    x: spot.x,
    y: spot.y,
    w: 25,
    h: 31,
    vx: 2.2,
    vy: 0,
    dir: 1,
    saved: false,
    rules: ["gravity", "alive", "solid"],
  }));
  won = false;
  rulesLeft = ruleBudgetFor(level);
  levelText.textContent = `${level.name} - ${levelIndex + 1}/${levels.length}`;
  removeWin();
  toastMessage(level.tip);
  renderStatic();
  updateCounter();
  updateRuleBudget();
}

function renderStatic() {
  updateStageLayout();
  stage.querySelectorAll(".entity,.creature,.exit").forEach((el) => el.remove());
  const exit = document.createElement("div");
  exit.className = "exit";
  exit.style.setProperty("--x", `${currentLevel.exit.x}px`);
  exit.style.setProperty("--y", `${currentLevel.exit.y}px`);
  stage.appendChild(exit);
  entities.forEach((entity) => {
    const el = document.createElement("div");
    el.className = `entity ${entity.type}`;
    el.dataset.id = entity.id;
    el.addEventListener("dragover", (event) => {
      event.preventDefault();
      el.classList.add("targeted");
    });
    el.addEventListener("dragleave", () => el.classList.remove("targeted"));
    el.addEventListener("drop", (event) => {
      event.preventDefault();
      const rule = event.dataTransfer.getData("text/plain") || dragging;
      applyRule(entity.id, rule);
      el.classList.remove("targeted");
    });
    el.addEventListener("mouseenter", () => inspect(entity));
    el.addEventListener("click", () => {
      if (selectedRule) {
        applyRule(entity.id, selectedRule);
        clearSelectedRule();
        return;
      }
      if (entity.type === "enemy" && has(entity, "sharp")) {
        removeRule(entity.id, "sharp", false);
        removeRule(entity.id, "solid", false);
        toastMessage(`${nameFor(entity)} is no longer Sharp or Solid. It is safe to pass.`);
      } else if ((entity.type === "wall" || entity.id === "door") && has(entity, "solid")) {
        removeRule(entity.id, "solid", false);
        toastMessage(`${nameFor(entity)} is no longer Solid. Scribbles can pass.`);
      }
    });
    stage.appendChild(el);
  });
  creatures.forEach((creature) => {
    const el = document.createElement("div");
    el.className = "creature";
    el.dataset.id = creature.id;
    const legs = document.createElement("div");
    legs.className = "legs";
    el.appendChild(legs);
    el.addEventListener("dragover", (event) => event.preventDefault());
    el.addEventListener("drop", (event) => {
      event.preventDefault();
      const rule = event.dataTransfer.getData("text/plain") || dragging;
      applyCreatureRule(creature.id, rule);
    });
    el.addEventListener("mouseenter", () => inspect(creature, "creature"));
    el.addEventListener("click", () => {
      if (!selectedRule) return;
      applyCreatureRule(creature.id, selectedRule);
      clearSelectedRule();
    });
    stage.appendChild(el);
  });
  syncDom();
}

function syncDom() {
  entities.forEach((entity) => {
    const el = stage.querySelector(`.entity[data-id="${entity.id}"]`);
    if (!el) return;
    el.style.setProperty("--x", `${entity.x}px`);
    el.style.setProperty("--y", `${entity.y}px`);
    el.style.setProperty("--w", `${entity.w}px`);
    el.style.setProperty("--h", `${entity.h}px`);
    el.style.setProperty("--rot", `${wobble(entity.id)}deg`);
    el.classList.toggle("ghost", !has(entity, "solid"));
    el.classList.toggle("burning", has(entity, "burning"));
    el.classList.toggle("fragile", has(entity, "fragile"));
    renderTags(el, entity, false);
    if (entity.broken) el.remove();
  });
  creatures.forEach((creature) => {
    const el = stage.querySelector(`.creature[data-id="${creature.id}"]`);
    if (!el) return;
    el.style.setProperty("--x", `${creature.x}px`);
    el.style.setProperty("--y", `${creature.y}px`);
    el.style.setProperty("--face", creature.dir);
    el.classList.toggle("saved", creature.saved);
    renderTags(el, creature, true);
  });
}

function renderTags(el, item, isCreature) {
  let row = el.querySelector(".tag-row");
  if (!row) {
    row = document.createElement("div");
    row.className = "tag-row";
    el.appendChild(row);
  }
  row.innerHTML = "";
  item.rules.slice(0, 4).forEach((key) => {
    if (isCreature && ["alive", "gravity", "solid"].includes(key)) return;
    const tag = document.createElement("button");
    tag.className = "tag";
    tag.type = "button";
    tag.textContent = ruleMap[key]?.[1] || key;
    tag.title = "Remove rule";
    tag.addEventListener("click", (event) => {
      event.stopPropagation();
      removeRule(item.id, key, isCreature);
    });
    row.appendChild(tag);
  });
}

function has(item, rule) {
  return item.rules.includes(rule);
}

function applyRule(id, rule) {
  const entity = entities.find((item) => item.id === id && !item.broken);
  if (!entity || !rule) return;
  const isNewRule = !entity.rules.includes(rule);
  if (isNewRule && !spendRule()) return;
  if (isNewRule) entity.rules.push(rule);
  reactToRule(entity, rule);
  inspect(entity);
  syncDom();
  blip(420, 0.07, "square");
  toastMessage(`${ruleMap[rule][1]} attached to ${nameFor(entity)}.`);
}

function applyCreatureRule(id, rule) {
  const creature = creatures.find((item) => item.id === id && !item.saved);
  if (!creature || !rule) return;
  const isNewRule = !creature.rules.includes(rule);
  if (isNewRule && !spendRule()) return;
  if (isNewRule) creature.rules.push(rule);
  if (rule === "bouncy") creature.vy = -8.5;
  if (rule === "floating") creature.vy = -4;
  inspect(creature, "creature");
  syncDom();
  blip(520, 0.08, "sine");
  toastMessage(`The scribble received ${ruleMap[rule][1]}.`);
}

function removeRule(id, rule, isCreature) {
  const list = isCreature ? creatures : entities;
  const item = list.find((entry) => entry.id === id);
  if (!item) return;
  item.rules = item.rules.filter((entry) => entry !== rule);
  inspect(item, isCreature ? "creature" : "object");
  syncDom();
  blip(180, 0.05, "sawtooth");
}

function spendRule() {
  if (rulesLeft <= 0) {
    toastMessage("No rules left. Remove a tag or restart the level.");
    blip(110, 0.08, "sawtooth");
    return false;
  }
  rulesLeft -= 1;
  updateRuleBudget();
  return true;
}

function reactToRule(entity, rule) {
  if (rule === "floating") {
    entity.vy = -4.5;
    entity.rules = entity.rules.filter((entry) => entry !== "gravity");
  }
  if (rule === "heavy") entity.vy += 3;
  if (rule === "bouncy") entity.vy = -7;
  if (rule === "alive") entity.aliveDir = entity.aliveDir || 1;
  if (entity.type === "enemy" && rule === "sticky") {
    entity.rules = entity.rules.filter((entry) => !["sharp", "solid"].includes(entry));
  }
  if (rule === "burning") {
    entities.forEach((other) => {
      if (other !== entity && has(other, "fragile") && overlap(entity, other, 22)) breakObject(other);
    });
  }
}

function breakObject(entity) {
  if (entity.broken) return;
  entity.broken = true;
  entity.rules = [];
  blip(90, 0.12, "sawtooth");
  toastMessage(`${nameFor(entity)} breaks apart. Reality accepts the paperwork.`);
}

function inspect(item, type = "object") {
  const title = type === "creature" ? "Scribble" : nameFor(item);
  const active = item.rules.map((key) => ruleMap[key]?.[1] || key).join(", ") || "none";
  inspector.innerHTML = `<h3>${title}</h3><p>Rules: ${active}</p>`;
}

function nameFor(entity) {
  const names = {
    floor: "Floor",
    bankL: "Left Bank",
    bankR: "Right Bank",
    water: "Water",
    stone: "Stone",
    wall: "Wall",
    pitL: "Pit Edge",
    pitR: "Far Edge",
    mistBridge: "Blue Bridge",
    crate: "Box",
    enemy: "Enemy",
    ceiling: "Shelf",
    left: "Left Island",
    right: "Right Island",
    springStone: "Stone",
    door: "Door",
    fireBox: "Burning Box",
  };
  return names[entity.id] || entity.type;
}

function tick(now) {
  const dt = Math.min(2, (now - lastTime) / 16.67);
  lastTime = now;
  updateEntities(dt);
  updateCreatures(dt);
  checkWin();
  syncDom();
  requestAnimationFrame(tick);
}

function updateEntities(dt) {
  entities.forEach((entity) => {
    if (entity.broken) return;
    if (has(entity, "alive")) {
      entity.vx += 0.08 * entity.aliveDir * dt;
      if (entity.x < 10 || entity.x + entity.w > W - 10) entity.aliveDir *= -1;
    }
    if (has(entity, "gravity")) entity.vy += GRAVITY * dt * (has(entity, "heavy") ? 1.7 : 1);
    if (has(entity, "floating")) entity.vy += (Math.sin(performance.now() / 350 + entity.x) * 0.05 - 0.09) * dt;
    entity.x += entity.vx * dt;
    entity.y += entity.vy * dt;
    entity.vx *= has(entity, "sticky") ? 0.65 : 0.96;
    collideWithSolids(entity, true);
    if (entity.y > H + 120) {
      entity.y = -60;
      entity.vy = 0;
    }
  });
}

function updateCreatures(dt) {
  creatures.forEach((creature) => {
    if (creature.saved) return;
    creature.vx += 0.12 * creature.dir * dt;
    creature.vx = clamp(creature.vx, -3.1, has(creature, "bouncy") ? 3.8 : 3.0);
    if (has(creature, "gravity")) creature.vy += GRAVITY * dt;
    if (has(creature, "floating")) creature.vy -= 0.26 * dt;
    creature.x += creature.vx * dt;
    creature.y += creature.vy * dt;
    const hit = collideWithSolids(creature, false);
    if (hit.side) {
      creature.dir *= -1;
      creature.vx = creature.dir * 2.2;
    }
    if (creature.x < 0 || creature.x + creature.w > W) {
      creature.dir *= -1;
      creature.vx = creature.dir * 2.2;
      creature.x = clamp(creature.x, 0, W - creature.w);
    }
    nudgeCreatureForward(creature);
    interactCreature(creature);
    if (creature.y > H + 90) respawn(creature);
  });
}

function nudgeCreatureForward(creature) {
  const aheadX = creature.dir > 0 ? creature.x + creature.w + 4 : creature.x - 4;
  const footY = creature.y + creature.h + 3;
  const floorAhead = entities.some((entity) => (
    !entity.broken &&
    has(entity, "solid") &&
    aheadX >= entity.x &&
    aheadX <= entity.x + entity.w &&
    footY >= entity.y &&
    footY <= entity.y + entity.h + 8
  ));
  if (!floorAhead && creature.vy === 0) creature.vy = -3.8;
}

function collideWithSolids(item, isEntity) {
  let result = { floor: false, side: false };
  const solids = entities.filter((entity) => entity !== item && !entity.broken && has(entity, "solid"));
  solids.forEach((solid) => {
    if (!aabb(item, solid)) return;
    const bottomPenetration = item.y + item.h - solid.y;
    if (item.vy >= 0 && bottomPenetration > 0 && bottomPenetration < 52) {
      item.y = solid.y - item.h;
      item.vy = has(item, "bouncy") || has(solid, "bouncy") ? -8.5 : 0;
      item.vx *= has(solid, "sticky") ? 0.28 : FRICTION;
      result.floor = true;
      return;
    }
    const prevBottom = item.y + item.h - item.vy;
    const prevTop = item.y - item.vy;
    const prevRight = item.x + item.w - item.vx;
    const prevLeft = item.x - item.vx;
    if (prevBottom <= solid.y + 5 && item.vy >= 0) {
      item.y = solid.y - item.h;
      item.vy = has(item, "bouncy") || has(solid, "bouncy") ? -8.5 : 0;
      item.vx *= has(solid, "sticky") ? 0.28 : FRICTION;
      result.floor = true;
    } else if (prevTop >= solid.y + solid.h - 5 && item.vy < 0) {
      item.y = solid.y + solid.h;
      item.vy = Math.abs(item.vy) * 0.35;
    } else if (prevRight <= solid.x + 6) {
      if (!isEntity && item.y + item.h <= solid.y + STEP_HEIGHT) {
        item.y = solid.y - item.h;
        item.vy = 0;
        result.floor = true;
      } else {
        item.x = solid.x - item.w;
        item.vx = isEntity ? -Math.abs(item.vx) * 0.35 : 0;
        result.side = true;
      }
    } else if (prevLeft >= solid.x + solid.w - 6) {
      if (!isEntity && item.y + item.h <= solid.y + STEP_HEIGHT) {
        item.y = solid.y - item.h;
        item.vy = 0;
        result.floor = true;
      } else {
        item.x = solid.x + solid.w;
        item.vx = isEntity ? Math.abs(item.vx) * 0.35 : 0;
        result.side = true;
      }
    }
  });
  return result;
}

function interactCreature(creature) {
  const exit = currentLevel.exit;
  if (rects(creature.x, creature.y, creature.w, creature.h, exit.x, exit.y, 58, 86)) {
    creature.saved = true;
    blip(760, 0.11, "triangle");
    updateCounter();
    return;
  }
  entities.forEach((entity) => {
    if (entity.broken || !aabb(creature, entity)) return;
    if (has(entity, "sharp") && !has(entity, "sticky")) respawn(creature);
    if (has(entity, "burning") && has(creature, "fragile")) respawn(creature);
    if (has(entity, "burning")) {
      entities.forEach((other) => {
        if (other !== entity && has(other, "fragile") && overlap(entity, other, 14)) breakObject(other);
      });
    }
    if (has(entity, "magnetic")) {
      creature.vx += Math.sign(entity.x - creature.x) * 0.12;
    }
  });
}

function respawn(creature) {
  const spot = levels[levelIndex].spawn[Number(creature.id.replace("c", ""))] || levels[levelIndex].spawn[0];
  creature.x = spot.x;
  creature.y = spot.y;
  creature.vx = 2.2;
  creature.vy = 0;
  creature.dir = 1;
  creature.rules = creature.rules.filter((rule) => !["bouncy", "floating", "fragile", "burning"].includes(rule));
  blip(120, 0.09, "square");
  toastMessage("Oops. The scribble went back to the start.");
}

function checkWin() {
  if (won || creatures.some((creature) => !creature.saved)) return;
  won = true;
  setTimeout(() => {
    const card = document.createElement("div");
    const isCustomLevel = currentLevel === customLevel;
    const isFinalLevel = !isCustomLevel && levelIndex === levels.length - 1;
    card.className = "win-card";
    card.innerHTML = `<h2>${isFinalLevel ? "Game Complete" : "Reality Assembled"}</h2><p>${currentLevel.name} cleared.</p><button type="button">${isCustomLevel || isFinalLevel ? "Restart" : "Next Level"}</button>`;
    card.querySelector("button").addEventListener("click", () => {
      if (isCustomLevel) loadCustomLevel();
      else loadLevel(isFinalLevel ? 0 : levelIndex + 1);
    });
    world.appendChild(card);
    fanfare();
  }, 220);
}

function removeWin() {
  world.querySelector(".win-card")?.remove();
}

function updateCounter() {
  const saved = creatures.filter((creature) => creature.saved).length;
  const total = creatures.length || 1;
  savedLabel.textContent = `Saved ${saved}/${creatures.length}`;
  saveMeterFill.style.setProperty("--saved-progress", `${(saved / total) * 100}%`);
}

function updateRuleBudget() {
  ruleBudget.textContent = `Rules ${rulesLeft}`;
  ruleBudget.classList.toggle("empty", rulesLeft <= 0);
}

function aabb(a, b) {
  return rects(a.x, a.y, a.w, a.h, b.x, b.y, b.w, b.h);
}

function rects(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function overlap(a, b, pad = 0) {
  return rects(a.x - pad, a.y - pad, a.w + pad * 2, a.h + pad * 2, b.x, b.y, b.w, b.h);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function wobble(seed) {
  return ((seed.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) % 9) - 4) * 0.8;
}

function toastMessage(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => toast.classList.remove("show"), 2800);
}

function getAudio() {
  if (muted) return null;
  audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function blip(freq, duration, type = "sine") {
  const ctx = getAudio();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration + 0.02);
}

function fanfare() {
  [420, 560, 740, 920].forEach((freq, i) => setTimeout(() => blip(freq, 0.11, "triangle"), i * 90));
}

world.addEventListener("mousemove", (event) => {
  const rect = world.getBoundingClientRect();
  hand.style.left = `${event.clientX - rect.left}px`;
  hand.style.top = `${event.clientY - rect.top}px`;
});

world.addEventListener("mouseleave", () => {
  hand.style.left = "-100px";
});

window.addEventListener("resize", updateStageLayout);

resetBtn.addEventListener("click", () => loadLevel(levelIndex));

savedCounter.addEventListener("click", () => {
  const saved = creatures.filter((creature) => creature.saved).length;
  toastMessage(`Goal: guide every scribble to the door. Saved ${saved}/${creatures.length}.`);
});

ruleBudget.addEventListener("click", () => {
  toastMessage(`Rule limit: you can attach ${rulesLeft} more new rule${rulesLeft === 1 ? "" : "s"}. Removing tags is free.`);
});

solveBtn.addEventListener("click", () => {
  autoSolveLevel();
});

function autoSolveLevel() {
  entities.forEach((entity) => {
    if (entity.type === "water") forceRule(entity.id, "solid");
    if (entity.type === "wall" || entity.id.includes("door")) forceRemove(entity.id, "solid");
    if (entity.type === "enemy") {
      forceRemove(entity.id, "sharp");
      forceRemove(entity.id, "solid");
      forceRule(entity.id, "sticky");
    }
    if (entity.type === "stone") {
      forceRemove(entity.id, "solid");
      forceRemove(entity.id, "heavy");
      forceRule(entity.id, "floating");
    }
    if (entity.type === "crate" || entity.id.includes("ceiling")) forceRemove(entity.id, "solid");
  });
  rulesLeft = 0;
  updateRuleBudget();
  toastMessage("Solution applied: bridges are Solid, obstacles are not Solid, enemies are not Sharp.");
  syncDom();
}

function forceRule(id, rule) {
  const entity = entities.find((item) => item.id === id && !item.broken);
  if (entity && !entity.rules.includes(rule)) entity.rules.push(rule);
}

function forceRemove(id, rule) {
  const entity = entities.find((item) => item.id === id && !item.broken);
  if (entity) entity.rules = entity.rules.filter((entry) => entry !== rule);
}

function loadCustomLevel() {
  currentLevel = customLevel;
  entities = customLevel.objects.map((item) => structuredClone(item));
  creatures = customLevel.spawn.map((spot, i) => ({
    id: `c${i}`,
    x: spot.x,
    y: spot.y,
    w: 25,
    h: 31,
    vx: 2.2,
    vy: 0,
    dir: 1,
    saved: false,
    rules: ["gravity", "alive", "solid"],
  }));
  won = false;
  rulesLeft = ruleBudgetFor(customLevel);
  levelText.textContent = `${customLevel.name} - Editor`;
  removeWin();
  toastMessage(customLevel.tip);
  renderStatic();
  updateCounter();
  updateRuleBudget();
}

function addEditorThing(x, y) {
  const id = `custom${editorTool}${Date.now()}`;
  if (editorTool === "spawn") {
    customLevel.spawn.push({ x: clamp(x - 12, 0, W - 30), y: clamp(y - 30, 0, H - 40) });
    toastMessage("Scribble spawn added.");
  } else if (editorTool === "exit") {
    customLevel.exit = { x: clamp(x - 29, 0, W - 60), y: clamp(y - 80, 0, H - 90) };
    toastMessage("Door moved.");
  } else {
    customLevel.objects.push(makeEditorObject(id, editorTool, x, y));
    toastMessage(`${editorTool} added.`);
  }
  loadCustomLevel();
}

function makeEditorObject(id, type, x, y) {
  const size = {
    platform: [170, 36],
    water: [190, 30],
    wall: [38, 92],
    stone: [66, 66],
    enemy: [52, 52],
    crate: [58, 58],
  }[type] || [70, 50];
  const rulesByType = {
    platform: ["solid"],
    water: [],
    wall: ["solid"],
    stone: ["solid", "gravity", "heavy"],
    enemy: ["solid", "sharp"],
    crate: ["solid", "gravity"],
  };
  return obj(id, type, clamp(x - size[0] / 2, 0, W - size[0]), clamp(y - size[1] / 2, 0, H - size[1]), size[0], size[1], rulesByType[type] || ["solid"]);
}

editorToggle.addEventListener("click", () => {
  editorMode = !editorMode;
  editorToggle.textContent = editorMode ? "On" : "Off";
  document.body.classList.toggle("editing", editorMode);
  if (editorMode) loadCustomLevel();
  else loadLevel(levelIndex);
});

editorTools.addEventListener("click", (event) => {
  const button = event.target.closest("[data-tool]");
  if (!button) return;
  editorTool = button.dataset.tool;
  editorTools.querySelectorAll("button").forEach((item) => item.classList.toggle("selected", item === button));
  toastMessage(`Editor tool: ${button.textContent}. Click the world to place it.`);
});

playCustomBtn.addEventListener("click", () => {
  editorMode = false;
  editorToggle.textContent = "Off";
  document.body.classList.remove("editing");
  loadCustomLevel();
});

clearCustomBtn.addEventListener("click", () => {
  customLevel = makeEmptyCustomLevel();
  loadCustomLevel();
  toastMessage("Custom level cleared.");
});

world.addEventListener("click", (event) => {
  if (!editorMode || event.target !== world) return;
  const point = clientToGame(event.clientX, event.clientY);
  addEditorThing(point.x, point.y);
});

world.addEventListener("click", (event) => {
  if (!editorMode) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  const point = clientToGame(event.clientX, event.clientY);
  addEditorThing(point.x, point.y);
}, true);

window.addEventListener("dragend", clearDrag);

muteBtn.addEventListener("click", () => {
  muted = !muted;
  muteBtn.textContent = muted ? "Muted" : "Sound";
});

setupRules();
loadLevel(0);
updateStageLayout();
requestAnimationFrame(tick);
