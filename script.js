// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile menu
const nav = document.querySelector(".nav");
const toggle = document.querySelector(".nav__toggle");
toggle.addEventListener("click", () => {
  const open = nav.toggleAttribute("data-open");
  toggle.setAttribute("aria-expanded", open);
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});
nav.querySelectorAll(".nav__links a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.removeAttribute("data-open");
    toggle.setAttribute("aria-expanded", "false");
  })
);

// Copy email button
const copyBtn = document.getElementById("copy-email");
const copyLabel = copyBtn.querySelector(".copy__label");
copyBtn.addEventListener("click", async () => {
  const email = copyBtn.dataset.email;
  try {
    await navigator.clipboard.writeText(email);
  } catch {
    window.location.href = `mailto:${email}`;
    return;
  }
  copyLabel.textContent = "Copied!";
  setTimeout(() => (copyLabel.textContent = "Copy email"), 2000);
});

// IKEA projects carousel (desktop): the arrow shows the next card
const projects = [...document.querySelectorAll(".project")];
let current = 0;
projects[0].classList.add("is-active");
document.querySelector(".projects__next").addEventListener("click", () => {
  projects[current].classList.remove("is-active");
  current = (current + 1) % projects.length;
  projects[current].classList.add("is-active");
});

// Companies marquee: duplicate the logos so the loop is seamless
const group = document.querySelector(".marquee__group");
const copy = group.cloneNode(true);
copy.setAttribute("aria-hidden", "true");
copy.querySelectorAll("img").forEach((img) => (img.alt = ""));
group.after(copy);

// Curated readings: dots + autoplay
const track = document.querySelector(".readings__track");
const books = [...track.children];
const dots = document.querySelector(".readings__dots");
books.forEach((_, i) => {
  const b = document.createElement("button");
  b.setAttribute("role", "tab");
  b.setAttribute("aria-label", `Book ${i + 1}`);
  b.addEventListener("click", () => goTo(i));
  dots.appendChild(b);
});
function goTo(i) {
  const li = books[i];
  track.scrollTo({ left: li.offsetLeft - (track.clientWidth - li.offsetWidth) / 2, behavior: "smooth" });
}
function activeIndex() {
  const mid = track.scrollLeft + track.clientWidth / 2;
  let best = 0;
  books.forEach((li, i) => {
    if (Math.abs(li.offsetLeft + li.offsetWidth / 2 - mid) < Math.abs(books[best].offsetLeft + books[best].offsetWidth / 2 - mid)) best = i;
  });
  return best;
}
function updateDots() {
  const a = activeIndex();
  [...dots.children].forEach((d, i) => d.setAttribute("aria-selected", i === a));
}
track.addEventListener("scroll", () => requestAnimationFrame(updateDots), { passive: true });
updateDots();
let autoplay = setInterval(() => goTo((activeIndex() + 1) % books.length), 3500);
["pointerdown", "wheel", "focusin"].forEach((ev) =>
  track.addEventListener(ev, () => clearInterval(autoplay), { passive: true })
);
if (matchMedia("(prefers-reduced-motion: reduce)").matches) clearInterval(autoplay);

// Fridge magnet letters (draggable inside the fridge door)
const door = document.getElementById("fridge");
door.querySelectorAll(".magnet").forEach((el) => {
  let startX, startY, origX, origY, scale;
  el.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    el.setPointerCapture(e.pointerId);
    el.classList.add("dragging");
    scale = door.getBoundingClientRect().width / door.offsetWidth || 1;
    startX = e.clientX;
    startY = e.clientY;
    origX = el.offsetLeft;
    origY = el.offsetTop;
  });
  el.addEventListener("pointermove", (e) => {
    if (!el.classList.contains("dragging")) return;
    const maxX = door.clientWidth - el.offsetWidth;
    const maxY = door.clientHeight - el.offsetHeight;
    el.style.left = `${Math.min(Math.max(0, origX + (e.clientX - startX) / scale), maxX)}px`;
    el.style.top = `${Math.min(Math.max(0, origY + (e.clientY - startY) / scale), maxY)}px`;
  });
  const end = () => el.classList.remove("dragging");
  el.addEventListener("pointerup", end);
  el.addEventListener("pointercancel", end);
});
