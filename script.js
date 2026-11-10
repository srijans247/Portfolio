const roles = [
  "real-time dashboards",
  "AI agents",
  "webhook automations",
  "machine-learning tools",
  "music apps and clean interfaces",
];

const paletteItems = [
  { label: "Ask about Srijan", href: "#ask" },
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
  if (item.href === "#ask") {
    openAsk();
    return;
  }
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

const profileFacts = [
  {
    id: "overview",
    keywords: ["everything", "overview", "summary", "profile", "resume", "cv", "background", "introduce", "introduction", "bio"],
    phrases: ["tell me everything", "about srijan", "who is srijan", "full profile", "sum up"],
    text: "Srijan Shrestha is a Computer Science graduate based in New Delhi, specializing in artificial intelligence and practical software. He holds a B.E. in Computer Science and Engineering from Sathyabama Institute of Science and Technology (2021–2025) with a CGPA of 8.14 / 10.\n\nHe interned as a Full Stack Engineer at Surepass Technologies in New Delhi from October 2025 to February 2026. There he built a real-time caller dashboard, a sales performance dashboard fed by ClickUp webhooks into Supabase, webhook automation between ClickUp and internal tools, and a compliance agent that flags gambling-related websites and social content.\n\nHis public work also includes Musicify, an AI chatbot, Agri Growth, email and SMS spam detection, laptop price prediction, a SIP calculator, Smart Task Manager, and a Netflix clone. He is strongest in Python, JavaScript, TypeScript, SQL, React, Next.js, Tailwind, Supabase, machine learning, and NLP.\n\nHe speaks English and Hindi, holds a PCAP Python certification (June 2025), an AWS Cloud certificate from Credo Systems (2023), and Cognibot machine-learning training (2023). He is open to software and AI roles.",
  },
  {
    id: "who",
    keywords: ["who", "about", "yourself", "person", "engineer", "developer", "graduate", "student"],
    phrases: ["who are you", "who is he", "who is srijan", "what do you do", "what does he do"],
    text: "Srijan Shrestha is a Computer Science graduate who builds practical tools: real-time dashboards, webhook automations, machine-learning models, and AI agents. He works mainly with Python, JavaScript, and Supabase, and he describes his focus as useful software rather than slideware. He is based in New Delhi and is open to software and AI roles.",
  },
  {
    id: "location",
    keywords: ["where", "live", "lives", "located", "location", "based", "city", "delhi", "india", "chennai", "from"],
    phrases: ["where does he live", "where is he based", "where are you", "which city"],
    text: "Srijan is based in New Delhi, India. His degree is from Sathyabama Institute of Science and Technology in Chennai, and the Surepass internship was also in New Delhi.",
  },
  {
    id: "availability",
    keywords: ["hire", "hiring", "job", "role", "roles", "opening", "open", "available", "availability", "looking", "opportunity", "opportunities", "intern", "fulltime", "freelance", "join"],
    phrases: ["open to work", "is he available", "can i hire", "looking for"],
    text: "Yes. Srijan is open to software and AI roles. The strongest fit is work that involves Python or JavaScript, real-time data, dashboards, automation, or applied machine learning. A recruiter can email srijans247@gmail.com, call +91 8002423224, or message him on LinkedIn.",
  },
  {
    id: "education",
    keywords: ["education", "degree", "college", "university", "sathyabama", "be", "btech", "engineering", "graduated", "graduation", "studied", "study", "school", "cgpa", "gpa", "marks", "score", "class", "xii", "12th", "10th"],
    phrases: ["where did he study", "what is his cgpa", "educational background"],
    text: "Srijan completed a B.E. in Computer Science and Engineering at Sathyabama Institute of Science and Technology, Chennai, from 2021 to 2025, with a CGPA of 8.14 / 10. Before that he finished Class XII (2019–2021) at M.P. College, Arakapur, and Class X (2018) at D.A.V. Centenary Public School.",
  },
  {
    id: "experience",
    keywords: ["experience", "work", "worked", "internship", "intern", "surepass", "company", "employer", "job", "professional"],
    phrases: ["work experience", "where did he work", "tell me about surepass", "what did he do at surepass"],
    text: "Srijan was a Full Stack Engineer Intern at Surepass Technologies, New Delhi, from October 2025 to February 2026. He worked on sales operations and compliance: a caller dashboard for live call logs and recordings, a sales performance dashboard, ClickUp-to-Supabase webhook automation, and a compliance AI agent. The stack was JavaScript, Python, Supabase, and ClickUp webhooks.",
  },
  {
    id: "caller",
    keywords: ["caller", "call", "calls", "recording", "recordings", "dashboard"],
    phrases: ["caller dashboard", "call logs"],
    text: "The Caller Dashboard is a Surepass project. It tracks the sales team’s call logs and recordings in real time, with the data stored and queried in Supabase.",
  },
  {
    id: "compliance",
    keywords: ["compliance", "gambling", "agent", "agents", "moderation", "detect", "detection"],
    phrases: ["compliance agent", "gambling websites", "ai agent"],
    text: "At Surepass, Srijan built a compliance AI agent that detects gambling-related websites and social content using keyword search. He also has a separate portfolio project, an AI chatbot built with Next.js, TypeScript, Tailwind, and Radix UI, with streaming replies and theme switching.",
  },
  {
    id: "sales",
    keywords: ["sales", "metrics", "performance", "clickup", "webhook", "webhooks", "automation"],
    phrases: ["sales dashboard", "clickup webhook", "sales performance"],
    text: "The Sales Performance Dashboard monitors sales metrics at Surepass. ClickUp webhooks feed Supabase so the numbers stay current, and the same webhook path was automated into the internal dashboards used for sales and compliance monitoring.",
  },
  {
    id: "skills",
    keywords: ["skill", "skills", "stack", "toolkit", "tech", "technology", "technologies", "languages", "python", "javascript", "typescript", "sql", "react", "next", "nextjs", "tailwind", "supabase", "git", "ml", "nlp", "jupyter"],
    phrases: ["what can he do", "tech stack", "programming languages", "what is he good at"],
    text: "Languages: Python, SQL, JavaScript, TypeScript, HTML, and CSS. For product work he uses Next.js, React, Tailwind CSS, Radix UI, and Lucide. Platforms he relies on are Supabase, ClickUp webhooks, Git, VS Code, and Jupyter. His AI practice covers machine learning, deep learning, image classification, and NLP. Day to day he uses Python for models and glue code, JavaScript for the interface, and Supabase when the data needs a home.",
  },
  {
    id: "spoken",
    keywords: ["speak", "speaks", "speaking", "hindi", "english", "language", "languages", "communication"],
    phrases: ["languages does he speak", "can he speak hindi"],
    text: "Srijan speaks English and Hindi, and he is comfortable walking through a system on a call or in writing.",
  },
  {
    id: "projects",
    keywords: ["project", "projects", "portfolio", "built", "build", "builds", "github", "repos", "repositories", "work"],
    phrases: ["show me his projects", "what has he built", "selected projects"],
    text: "Selected public projects:\n• Musicify (2023) — a music streaming web app in HTML, CSS, and JavaScript. Songs load asynchronously and albums come from JSON.\n• AI Chatbot (January 2025) — Next.js, TypeScript, Tailwind, and Radix UI, with streaming replies. Featured on his resume.\n• Agri Growth (December 2024) — plant disease prediction, fertilizer recommendation, and soil-quality models in Python.\n• Email and SMS Spam Detection (2024) — an NLP notebook that classifies messages.\n• Laptop Price Prediction (2024) — regression from hardware specs.\n• SIP Calculator (2023) — a React calculator; his starred public repo.\n• Smart Task Manager (2025) — a Python task manager.\n• Netflix Clone (2025) — a responsive streaming home-screen layout.\n• Smaller experiments: Chess, Snake, a CSS dancing robot, a second music player, and an AWS assignment.\n\nThe live list on this page is loaded from github.com/srijans247.",
  },
  {
    id: "musicify",
    keywords: ["musicify", "music", "streaming", "player", "songs"],
    phrases: ["music app", "musicify project"],
    text: "Musicify (2023) is a music streaming web app. Songs load asynchronously from server directories, and albums render with cover art and metadata from JSON, without a full page reload. It uses HTML, CSS, and JavaScript. Repository: github.com/srijans247/Musicify-music-app.",
  },
  {
    id: "chatbot",
    keywords: ["chatbot", "chat", "bot", "nextjs", "radix"],
    phrases: ["ai chatbot", "his chatbot project"],
    text: "Srijan’s AI Chatbot project (January 2025) is a responsive chat interface with streaming replies, dark and light mode, and a Next.js plus TypeScript architecture. API keys stay in environment config. The stack is Next.js, TypeScript, Tailwind, and Radix UI. It is featured on his resume.",
  },
  {
    id: "agri",
    keywords: ["agri", "agriculture", "farming", "plant", "disease", "fertilizer", "soil", "crop"],
    phrases: ["agri growth", "plant disease"],
    text: "Agri Growth (December 2024) is a precision-farming project. The models cover plant disease prediction, fertilizer recommendation, and soil quality, including image-based disease detection. It uses Python, deep learning, and machine learning. Repository: github.com/srijans247/Agri-Growth.",
  },
  {
    id: "spam",
    keywords: ["spam", "email", "sms", "nlp", "message", "messages"],
    phrases: ["spam detection", "email spam"],
    text: "Email and SMS Spam Detection (2024) is a Jupyter notebook that classifies messages as spam or legitimate. It is a classic NLP pipeline in Python. Repository: github.com/srijans247/Email-SMS-Spam-Detection.",
  },
  {
    id: "laptop",
    keywords: ["laptop", "price", "prediction", "regression", "hardware"],
    phrases: ["laptop price", "price prediction"],
    text: "Laptop Price Prediction (2024) is a regression notebook that estimates laptop prices from hardware specs, written in Python and Jupyter. Repository: github.com/srijans247/laptop-price-prediction.",
  },
  {
    id: "sip",
    keywords: ["sip", "investment", "calculator", "finance", "mutual"],
    phrases: ["sip calculator", "systematic investment"],
    text: "The SIP Calculator (2023) is a React and JavaScript app for systematic investment plan calculations. It is the public repository that has a star. Repository: github.com/srijans247/SIP-Calculator.",
  },
  {
    id: "tasks",
    keywords: ["task", "tasks", "todo", "manager"],
    phrases: ["task manager", "smart task"],
    text: "Smart Task Manager (2025) is a Python task manager, published around the same period as the Surepass internship. Repository: github.com/srijans247/smart-task-manager.",
  },
  {
    id: "netflix",
    keywords: ["netflix", "clone", "frontend", "front"],
    phrases: ["netflix clone"],
    text: "The Netflix Clone (2025) is a front-end recreation of a streaming home screen: layout, browse rows, and responsive CSS, built with HTML and CSS. Repository: github.com/srijans247/Netflix-Clone.",
  },
  {
    id: "certs",
    keywords: ["certificate", "certificates", "certification", "certifications", "pcap", "aws", "cognibot", "credential", "credentials", "course", "training"],
    phrases: ["python certification", "aws certificate"],
    text: "Srijan has three certifications listed on this site. PCAP, Certified Associate in Python Programming, completed in June 2025. An AWS Cloud certificate from Credo Systems, July to September 2023. Cognibot, “AI meets Industry,” a machine-learning training program from January to April 2023.",
  },
  {
    id: "contact",
    keywords: ["contact", "email", "mail", "phone", "mobile", "number", "call", "linkedin", "github", "reach", "connect", "whatsapp", "resume", "cv", "pdf"],
    phrases: ["how do i contact", "email address", "phone number", "get in touch", "download resume"],
    text: "You can reach Srijan at srijans247@gmail.com or +91 8002423224. GitHub: github.com/srijans247. LinkedIn: linkedin.com/in/srijan-shrestha-77990b210. A resume PDF is linked from the hero and the contact section of this page. The contact form only opens your mail app; messages are not stored on a server.",
    links: [
      { label: "Email Srijan", href: "mailto:srijans247@gmail.com" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/srijan-shrestha-77990b210" },
      { label: "GitHub", href: "https://github.com/srijans247" },
      { label: "Download resume", href: "Srijan_Shrestha_Resume.pdf" },
    ],
  },
  {
    id: "values",
    keywords: ["care", "cares", "values", "style", "process", "approach", "strength", "strengths", "interested", "interest"],
    phrases: ["how does he work", "what does he care about", "working style"],
    text: "Srijan cares about real-time data, clear interfaces, and automation that removes a manual step someone dislikes. His working style is Python for models and glue, JavaScript for the product surface, and Supabase when the data needs a home.",
  },
];

const privateTopics = ["salary", "ctc", "package", "stipend", "age", "birthday", "married", "girlfriend", "boyfriend", "religion", "caste", "address", "aadhaar", "aadhar", "pan"];
const greetWords = new Set(["hi", "hello", "hey", "hola", "yo", "good", "morning", "afternoon", "evening", "namaste", "sup"]);
const stopWords = new Set(["a", "an", "the", "is", "are", "was", "were", "of", "to", "for", "and", "or", "in", "on", "at", "me", "him", "his", "he", "she", "you", "your", "please", "can", "could", "would", "tell", "about", "does", "do", "did", "with", "from", "that", "this", "any", "anything", "something", "srijan", "shrestha", "has", "have", "had", "what", "who", "where", "when", "why", "how", "which", "i", "we", "my", "know", "want"]);

const askPanel = document.querySelector("#askPanel");
const askLaunch = document.querySelector("#askLaunch");
const askLog = document.querySelector("#askLog");
const askForm = document.querySelector("#askForm");
const askInput = document.querySelector("#askInput");
const askSuggestions = document.querySelector("#askSuggestions");

const suggestions = [
  "Who is Srijan?",
  "What did he do at Surepass?",
  "Which projects stand out?",
  "What is his tech stack?",
  "How do I contact him?",
];

function addMessage(role, text, links) {
  const item = document.createElement("p");
  item.className = `ask-msg ${role}`;
  item.textContent = text;
  if (links?.length) {
    item.append(document.createTextNode("\n"));
    links.forEach((link, index) => {
      if (index) item.append(document.createTextNode(" · "));
      const anchor = document.createElement("a");
      anchor.href = link.href;
      anchor.textContent = link.label;
      if (!link.href.startsWith("mailto:") && !link.href.endsWith(".pdf")) {
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
      }
      item.append(anchor);
    });
  }
  askLog.append(item);
  askLog.scrollTop = askLog.scrollHeight;
}

function tokenize(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9+\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word && !stopWords.has(word) && !greetWords.has(word));
}

function tokenForms(token) {
  const forms = [token];
  if (token.endsWith("s") && token.length > 4) forms.push(token.slice(0, -1));
  if (token === "nextjs" || token === "next") forms.push("next", "nextjs");
  return forms;
}

function scoreFact(fact, query, tokens) {
  let score = 0;
  const hay = `${fact.text} ${fact.keywords.join(" ")}`.toLowerCase();
  fact.phrases.forEach((phrase) => {
    if (query.includes(phrase)) score += 9;
  });
  fact.keywords.forEach((keyword) => {
    const hit = tokens.some((token) => tokenForms(token).includes(keyword));
    if (hit) score += keyword.length > 5 ? 5 : 3;
    else if (query.includes(keyword) && keyword.length > 4) score += 2;
  });
  tokens.forEach((token) => {
    if (token.length > 3 && hay.includes(token) && !fact.keywords.includes(token)) score += 1;
  });
  return score;
}

function answerQuestion(raw) {
  const query = raw.trim().toLowerCase().replace(/\s+/g, " ");
  const tokens = tokenize(query);
  const words = query.split(/\s+/).map((word) => word.replace(/[^a-z]/g, "")).filter(Boolean);
  const onlyGreeting = words.length > 0 && words.every((word) => greetWords.has(word));
  if (!query) return { text: "Ask me about Srijan’s experience, projects, education, skills, or how to contact him." };
  if (onlyGreeting) {
    return { text: "Hello. I can answer questions about Srijan Shrestha from the details published on this portfolio: his background, Surepass internship, projects, skills, education, and contact information. What would you like to know?" };
  }
  if (/thank/.test(query) && tokens.length < 3) {
    return { text: "You are welcome. If you would like to speak with Srijan directly, email srijans247@gmail.com." };
  }
  if (privateTopics.some((topic) => new RegExp(`\\b${topic}\\b`).test(query))) {
    return { text: "That detail is not published on this portfolio, so I will not guess. For anything beyond his public profile, email Srijan at srijans247@gmail.com." };
  }

  const ranked = profileFacts
    .map((fact) => ({ fact, score: scoreFact(fact, query, tokens) }))
    .sort((a, b) => b.score - a.score);
  const best = ranked[0];
  if (!best || best.score < 3) {
    return { text: "I can only answer from Srijan’s public profile, and that question is not covered here. Try his experience at Surepass, a project name, his skills, education, or contact details — or email srijans247@gmail.com." };
  }

  let chosen = ranked.filter((item) => item.score >= Math.max(3, best.score * 0.72)).slice(0, 2);
  if (chosen.some((item) => item.fact.id === "overview")) {
    chosen = [chosen.find((item) => item.fact.id === "overview")];
  }
  if (chosen.length > 1 && chosen.some((item) => item.fact.id !== "who")) {
    chosen = chosen.filter((item) => item.fact.id !== "who");
  }
  const wantsDirectContact = /phone|number|email|contact|reach|linkedin|resume|call him|call you/.test(query);
  if (wantsDirectContact) chosen = chosen.filter((item) => item.fact.id !== "caller");
  const unique = [];
  chosen.forEach((item) => {
    if (!unique.some((kept) => kept.fact.text === item.fact.text)) unique.push(item);
  });
  const links = [];
  unique.forEach((item) => {
    item.fact.links?.forEach((link) => {
      if (!links.some((kept) => kept.href === link.href)) links.push(link);
    });
  });
  return { text: unique.map((item) => item.fact.text).join("\n\n"), links };
}

function openAsk() {
  if (!askPanel) return;
  askPanel.hidden = false;
  askLaunch?.setAttribute("aria-expanded", "true");
  if (!askLog.childElementCount) {
    addMessage("bot", "Hello. I answer questions about Srijan Shrestha for visitors of this site — professionally, and only from the information published here.");
  }
  askInput?.focus();
}
function closeAsk() {
  if (!askPanel) return;
  askPanel.hidden = true;
  askLaunch?.setAttribute("aria-expanded", "false");
  askLaunch?.focus();
}

suggestions.forEach((label) => {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", () => {
    addMessage("user", label);
    const reply = answerQuestion(label);
    addMessage("bot", reply.text, reply.links);
  });
  askSuggestions?.append(button);
});

askLaunch?.addEventListener("click", () => {
  askPanel.hidden ? openAsk() : closeAsk();
});
document.querySelector("#askClose")?.addEventListener("click", closeAsk);
askForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = askInput.value.trim();
  if (!value) return;
  addMessage("user", value);
  const reply = answerQuestion(value);
  addMessage("bot", reply.text, reply.links);
  askInput.value = "";
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && askPanel && !askPanel.hidden) closeAsk();
});
