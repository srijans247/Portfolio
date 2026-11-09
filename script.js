const roles = [
  "real-time dashboards",
  "AI agents",
  "webhook automations",
  "machine-learning tools",
  "music apps and clean interfaces",
];

const paletteItems = [
  { label: "About", href: "#about" },
  { label: "Experience at Surepass", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
  { label: "GitHub profile", href: "https://github.com/srijans247", external: true },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/srijan-shrestha-77990b210", external: true },
  { label: "Email Srijan", href: "mailto:srijans247@gmail.com", external: true },
  { label: "Download resume", href: "Srijan_Shrestha_Resume.pdf", external: true },
];

const typed = document.querySelector("#typed");
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function tickType() {
  const word = roles[roleIndex];
  charIndex += deleting ? -1 : 1;
  typed.textContent = word.slice(0, charIndex);
  let delay = deleting ? 42 : 78;
  if (!deleting && charIndex === word.length) {
    delay = 1400;
    deleting = true;
  } else if (deleting && charIndex === 0) {
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 280;
  }
  window.setTimeout(tickType, delay);
}
if (typed && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) tickType();
else if (typed) typed.textContent = roles[0];

const year = document.querySelector("#year");
if (year) year.textContent = String(new Date().getFullYear());

localStorage.removeItem("theme");
document.documentElement.dataset.theme = "dark";

const menuBtn = document.querySelector("#menuBtn");
const navLinks = document.querySelector("#navLinks");
menuBtn?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
});
navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuBtn?.setAttribute("aria-expanded", "false");
  });
});

const progress = document.querySelector("#progress");
const sections = [...document.querySelectorAll("main section")];
const navAnchors = [...document.querySelectorAll(".nav-links a")];
function onScroll() {
  const scrolled = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.width = `${height > 0 ? (scrolled / height) * 100 : 0}%`;
  let current = sections[0]?.id;
  sections.forEach((section) => {
    if (scrolled >= section.offsetTop - 140) current = section.id;
  });
  navAnchors.forEach((anchor) => {
    anchor.classList.toggle("active", anchor.getAttribute("href") === `#${current}`);
  });
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

document.querySelector("#toTop")?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.querySelectorAll("[data-count]").forEach((el) => {
  const decimals = Number(el.dataset.decimals || 0);
  el.textContent = Number(el.dataset.count).toFixed(decimals);
});

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-pressed", "false");
    });
    chip.classList.add("active");
    chip.setAttribute("aria-pressed", "true");
    const filter = chip.dataset.filter;
    document.querySelectorAll(".project").forEach((card) => {
      const tags = card.dataset.tags.split(" ");
      card.classList.toggle("hide", filter !== "all" && !tags.includes(filter));
    });
  });
});

const finePointer = window.matchMedia("(pointer: fine)").matches;
if (!finePointer) document.body.classList.add("touch");

if (finePointer && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const rx = (py - 0.5) * -8;
      const ry = (px - 0.5) * 10;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });

  document.querySelectorAll("[data-magnetic]").forEach((el) => {
    el.addEventListener("pointermove", (event) => {
      const rect = el.getBoundingClientRect();
      const x = event.clientX - (rect.left + rect.width / 2);
      const y = event.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
    });
    el.addEventListener("pointerleave", () => {
      el.style.transform = "";
    });
  });
}

const canvas = document.querySelector("#field");
if (canvas && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const ctx = canvas.getContext("2d");
  const points = Array.from({ length: 42 }, () => ({
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - 0.5) * 0.00045,
    vy: (Math.random() - 0.5) * 0.00045,
  }));
  let mouse = { x: 0.5, y: 0.4 };

  function resize() {
    canvas.width = canvas.offsetWidth * devicePixelRatio;
    canvas.height = canvas.offsetHeight * devicePixelRatio;
  }
  resize();
  window.addEventListener("resize", resize);
  canvas.parentElement?.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    mouse = {
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    };
  });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    points.forEach((point) => {
      point.x += point.vx;
      point.y += point.vy;
      if (point.x < 0 || point.x > 1) point.vx *= -1;
      if (point.y < 0 || point.y > 1) point.vy *= -1;
    });
    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < 0.16) {
          ctx.strokeStyle = `rgba(214,255,74,${0.22 - dist})`;
          ctx.beginPath();
          ctx.moveTo(points[i].x * canvas.width, points[i].y * canvas.height);
          ctx.lineTo(points[j].x * canvas.width, points[j].y * canvas.height);
          ctx.stroke();
        }
      }
      const dx = points[i].x - mouse.x;
      const dy = points[i].y - mouse.y;
      if (Math.hypot(dx, dy) < 0.18) {
        ctx.strokeStyle = "rgba(255,107,74,0.45)";
        ctx.beginPath();
        ctx.moveTo(points[i].x * canvas.width, points[i].y * canvas.height);
        ctx.lineTo(mouse.x * canvas.width, mouse.y * canvas.height);
        ctx.stroke();
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

const repoGrid = document.querySelector("#repoGrid");
const fallbackRepos = [
  ["Musicify-music-app", "HTML", "https://github.com/srijans247/Musicify-music-app"],
  ["Agri-Growth", "Python", "https://github.com/srijans247/Agri-Growth"],
  ["smart-task-manager", "Python", "https://github.com/srijans247/smart-task-manager"],
  ["modiji-magic-generator", "TypeScript", "https://github.com/srijans247/modiji-magic-generator"],
  ["SIP-Calculator", "React", "https://github.com/srijans247/SIP-Calculator"],
  ["Email-SMS-Spam-Detection", "Jupyter Notebook", "https://github.com/srijans247/Email-SMS-Spam-Detection"],
  ["laptop-price-prediction", "Jupyter Notebook", "https://github.com/srijans247/laptop-price-prediction"],
  ["Netflix-Clone", "HTML", "https://github.com/srijans247/Netflix-Clone"],
  ["Music-clone", "HTML", "https://github.com/srijans247/Music-clone"],
  ["Chess", "Python", "https://github.com/srijans247/Chess"],
  ["Snake_Game", "Python", "https://github.com/srijans247/Snake_Game"],
  ["Dancing-Robot", "CSS", "https://github.com/srijans247/Dancing-Robot"],
  ["assignment_aws", "Python", "https://github.com/srijans247/assignment_aws"],
];

function renderRepos(repos) {
  repoGrid.innerHTML = "";
  repos.forEach((repo) => {
    const link = document.createElement("a");
    link.className = "repo";
    link.href = repo.html_url;
    link.target = "_blank";
    link.rel = "noreferrer";
    const name = document.createElement("strong");
    name.textContent = repo.name.replaceAll("-", " ").replaceAll("_", " ");
    const meta = document.createElement("span");
    const stars = repo.stargazers_count ? ` · ${repo.stargazers_count} star` : "";
    meta.textContent = `${repo.language || "Code"}${stars}`;
    link.append(name, meta);
    repoGrid.append(link);
  });
}

fetch("https://api.github.com/users/srijans247/repos?per_page=100&sort=updated")
  .then((response) => {
    if (!response.ok) throw new Error("GitHub unavailable");
    return response.json();
  })
  .then((repos) => {
    repos.sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));
    renderRepos(repos);
    const repoStat = document.querySelector('[data-count="13"]');
    if (repoStat && repos.length) {
      repoStat.dataset.count = String(repos.length);
      repoStat.textContent = String(repos.length);
    }
  })
  .catch(() => {
    renderRepos(
      fallbackRepos.map(([name, language, html_url]) => ({
        name,
        language,
        html_url,
        stargazers_count: name === "SIP-Calculator" ? 1 : 0,
      }))
    );
  });

document.querySelector("#contactForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const message = String(data.get("message") || "").trim();
  const body = `${message}\n\n— ${name}\n${email}`;
  const url = `mailto:srijans247@gmail.com?subject=${encodeURIComponent(`Portfolio note from ${name}`)}&body=${encodeURIComponent(body)}`;
  window.location.href = url;
  const note = document.querySelector("#formNote");
  if (note) note.textContent = "Your mail app should open with this message. If it does not, email srijans247@gmail.com directly.";
});

const palette = document.querySelector("#palette");
const paletteInput = document.querySelector("#paletteInput");
const paletteList = document.querySelector("#paletteList");
let paletteActive = 0;
let paletteVisible = [];

function openPalette() {
  palette.hidden = false;
  paletteInput.value = "";
  renderPalette("");
  paletteInput.focus();
}
function closePalette() {
  palette.hidden = true;
}
function renderPalette(query) {
  const q = query.trim().toLowerCase();
  paletteVisible = paletteItems.filter((item) => item.label.toLowerCase().includes(q));
  paletteActive = 0;
  paletteList.innerHTML = "";
  paletteVisible.forEach((item, index) => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = item.label;
    if (index === 0) button.classList.add("active");
    button.addEventListener("click", () => goPalette(item));
    li.append(button);
    paletteList.append(li);
  });
  if (!paletteVisible.length) {
    const li = document.createElement("li");
    li.textContent = "Nothing matches.";
    paletteList.append(li);
  }
}
function goPalette(item) {
  closePalette();
  if (item.href.startsWith("#")) {
    document.querySelector(item.href)?.scrollIntoView({ behavior: "smooth" });
  } else {
    window.open(item.href, item.href.startsWith("mailto:") ? "_self" : "_blank", "noopener");
  }
}
document.querySelector("#cmdBtn")?.addEventListener("click", openPalette);
palette?.addEventListener("click", (event) => {
  if (event.target === palette) closePalette();
});
paletteInput?.addEventListener("input", () => renderPalette(paletteInput.value));
document.addEventListener("keydown", (event) => {
  const meta = event.ctrlKey || event.metaKey;
  if (meta && event.key.toLowerCase() === "k") {
    event.preventDefault();
    palette.hidden ? openPalette() : closePalette();
    return;
  }
  if (palette.hidden) return;
  if (event.key === "Escape") closePalette();
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    const dir = event.key === "ArrowDown" ? 1 : -1;
    paletteActive = (paletteActive + dir + paletteVisible.length) % Math.max(paletteVisible.length, 1);
    [...paletteList.querySelectorAll("button")].forEach((button, index) => {
      button.classList.toggle("active", index === paletteActive);
    });
  }
  if (event.key === "Enter" && paletteVisible[paletteActive]) {
    event.preventDefault();
    goPalette(paletteVisible[paletteActive]);
  }
});
