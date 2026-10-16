// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Copy email button
const copyBtn = document.getElementById("copy-email");
copyBtn.addEventListener("click", async () => {
  const email = copyBtn.dataset.email;
  try {
    await navigator.clipboard.writeText(email);
  } catch {
    window.location.href = `mailto:${email}`;
    return;
  }
  copyBtn.textContent = "Copied!";
  setTimeout(() => (copyBtn.textContent = "Copy email"), 2000);
});

// Curated readings carousel arrows
const track = document.querySelector(".readings__track");
document.querySelectorAll(".arrow").forEach((btn) => {
  btn.addEventListener("click", () => {
    const dir = Number(btn.dataset.dir);
    track.scrollBy({ left: dir * track.clientWidth * 0.8, behavior: "smooth" });
  });
});

// Fridge magnet letters (draggable)
const fridge = document.getElementById("fridge");
const colors = ["#e2462c", "#2b59c3", "#f2b705", "#1f8a5b", "#e86aa6", "#161514"];
const word = "PAULA";

function placeMagnets() {
  fridge.querySelectorAll(".magnet").forEach((m) => m.remove());
  const w = fridge.clientWidth;
  const h = fridge.clientHeight;
  const step = w / (word.length + 1);
  [...word].forEach((ch, i) => {
    const m = document.createElement("span");
    m.className = "magnet";
    m.textContent = ch;
    m.setAttribute("aria-hidden", "true");
    m.style.setProperty("--c", colors[i % colors.length]);
    const rot = (Math.random() * 16 - 8).toFixed(1);
    m.style.setProperty("--r", `${rot}deg`);
    m.style.transform = `rotate(${rot}deg)`;
    fridge.appendChild(m);
    m.style.left = `${step * (i + 1) - m.offsetWidth / 2}px`;
    m.style.top = `${h * 0.55 - m.offsetHeight / 2 + (Math.random() * 30 - 15)}px`;
    makeDraggable(m);
  });
}

function makeDraggable(el) {
  let startX, startY, origX, origY;
  el.addEventListener("pointerdown", (e) => {
    el.setPointerCapture(e.pointerId);
    el.classList.add("dragging");
    el.style.transform = "";
    startX = e.clientX;
    startY = e.clientY;
    origX = el.offsetLeft;
    origY = el.offsetTop;
    fridge.appendChild(el); // bring to front
  });
  el.addEventListener("pointermove", (e) => {
    if (!el.classList.contains("dragging")) return;
    const maxX = fridge.clientWidth - el.offsetWidth;
    const maxY = fridge.clientHeight - el.offsetHeight;
    el.style.left = `${Math.min(Math.max(0, origX + e.clientX - startX), maxX)}px`;
    el.style.top = `${Math.min(Math.max(0, origY + e.clientY - startY), maxY)}px`;
  });
  const end = () => {
    el.classList.remove("dragging");
    el.style.transform = `rotate(${el.style.getPropertyValue("--r")})`;
  };
  el.addEventListener("pointerup", end);
  el.addEventListener("pointercancel", end);
}

document.fonts.ready.then(placeMagnets);
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(placeMagnets, 200);
});
