(function () {
  "use strict";

  // ===== Storage =====
  const store = {
    get(k, d = null) {
      try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; }
      catch { return d; }
    },
    set(k, v) {
      try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
    }
  };

  // ===== i18n =====
  const T = {
    en: {
      "greeting.morning":   "Good Morning",
      "greeting.afternoon": "Good Afternoon",
      "greeting.evening":   "Good Evening",
      "greeting.night":     "Good Night",
      "name.add":           "Add your name",
      "name.placeholder":   "Your name",
      "timer.title":        "Focus Timer",
      "timer.start":        "Start",
      "timer.stop":         "Stop",
      "timer.reset":        "Reset",
      "timer.decrease":     "Decrease duration",
      "timer.increase":     "Increase duration",
      "tasks.title":        "To-Do List",
      "tasks.add":          "Add",
      "tasks.placeholder":  "Add a new task",
      "tasks.empty":        "No tasks yet. Enjoy the calm.",
      "tasks.progress": "{done} of {total} done",
      "tasks.delete":       "Delete task",
      "links.title":        "Quick Links",
      "links.add":          "Add Link",
      "links.namePlaceholder": "Name",
      "links.urlPlaceholder":  "https://example.com",
      "links.remove":          "Remove link",
      "theme.toggle":          "Toggle theme"
    },
    id: {
      "greeting.morning":   "Selamat Pagi",
      "greeting.afternoon": "Selamat Siang",
      "greeting.evening":   "Selamat Sore",
      "greeting.night":     "Selamat Malam",
      "name.add":           "Tambah nama",
      "name.placeholder":   "Nama kamu",
      "timer.title":        "Timer Fokus",
      "timer.start":        "Mulai",
      "timer.stop":         "Berhenti",
      "timer.reset":        "Ulang",
      "timer.decrease":     "Kurangi durasi",
      "timer.increase":     "Tambah durasi",
      "tasks.title":        "Daftar Tugas",
      "tasks.add":          "Tambah",
      "tasks.placeholder":  "Tambah tugas baru",
      "tasks.empty":        "Belum ada tugas. Nikmati ketenangan.",
      "tasks.progress": "{done} dari {total} selesai",
      "tasks.delete":       "Hapus tugas",
      "links.title":        "Tautan Cepat",
      "links.add":          "Tambah Tautan",
      "links.namePlaceholder": "Nama",
      "links.urlPlaceholder":  "https://example.com",
      "links.remove":          "Hapus tautan",
      "theme.toggle":          "Ganti tema"
    },
    ja: {
      "greeting.morning":   "おはようございます",
      "greeting.afternoon": "こんにちは",
      "greeting.evening":   "こんばんは",
      "greeting.night":     "おやすみなさい",
      "name.add":           "名前を追加",
      "name.placeholder":   "お名前",
      "timer.title":        "集中タイマー",
      "timer.start":        "開始",
      "timer.stop":         "停止",
      "timer.reset":        "リセット",
      "timer.decrease":     "時間を減らす",
      "timer.increase":     "時間を増やす",
      "tasks.title":        "やることリスト",
      "tasks.add":          "追加",
      "tasks.placeholder":  "タスクを追加",
      "tasks.empty":        "タスクなし。ゆっくりどうぞ。",
      "tasks.progress": "{done} / {total} 完了",
      "tasks.delete":       "削除",
      "links.title":        "クイックリンク",
      "links.add":          "リンク追加",
      "links.namePlaceholder": "名前",
      "links.urlPlaceholder":  "https://example.com",
      "links.remove":          "削除",
      "theme.toggle":          "テーマ切替"
    },
    de: {
      "greeting.morning":   "Guten Morgen",
      "greeting.afternoon": "Guten Tag",
      "greeting.evening":   "Guten Abend",
      "greeting.night":     "Gute Nacht",
      "name.add":           "Namen hinzufügen",
      "name.placeholder":   "Dein Name",
      "timer.title":        "Fokus-Timer",
      "timer.start":        "Start",
      "timer.stop":         "Stopp",
      "timer.reset":        "Zurück",
      "timer.decrease":     "Dauer verringern",
      "timer.increase":     "Dauer erhöhen",
      "tasks.title":        "Aufgabenliste",
      "tasks.add":          "Hinzufügen",
      "tasks.placeholder":  "Neue Aufgabe",
      "tasks.empty":        "Noch keine Aufgaben. Genieß die Ruhe.",
      "tasks.progress": "{done} von {total} erledigt",
      "tasks.delete":       "Aufgabe löschen",
      "links.title":        "Schnellzugriff",
      "links.add":          "Link hinzufügen",
      "links.namePlaceholder": "Name",
      "links.urlPlaceholder":  "https://example.com",
      "links.remove":          "Link entfernen",
      "theme.toggle":          "Design wechseln"
    }
  };

  const locales = { id:"id-ID", en:"en-US", ja:"ja-JP", de:"de-DE" };

  function t(key) {
    return (T[lang] && T[lang][key]) || T.en[key] || key;
  }

  let lang = store.get("dashboard.lang") || "";
  if (!lang) {
    const b = navigator.language.split("-")[0];
    lang = ["id","ja","de"].includes(b) ? b : "en";
  }

  function applyLanguage(code) {
    lang = code;
    document.documentElement.lang = code;
    document.querySelectorAll("[data-i18n]").forEach(el => {
      el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      el.placeholder = t(el.dataset.i18nPlaceholder);
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(el => {
      el.setAttribute("aria-label", t(el.dataset.i18nAria));
    });
    store.set("dashboard.lang", code);
    updateGreeting();
    // update dynamic aria-labels on task delete buttons
    document.querySelectorAll(".task-delete").forEach(b => b.setAttribute("aria-label", t("tasks.delete")));
    document.querySelectorAll(".link-chip-remove").forEach(b => b.setAttribute("aria-label", t("links.remove")));
  }

  // ===== Lang select =====
  const langSelect = document.getElementById("langSelect");
  langSelect.value = lang;
  langSelect.addEventListener("change", e => applyLanguage(e.target.value));

  // ===== Theme =====
  const themeBtn = document.getElementById("themeToggle");
  let theme = store.get("dashboard.theme") ||
    (matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);
  themeBtn.addEventListener("click", () => {
    theme = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    store.set("dashboard.theme", theme);
  });

  // ===== Clock / Greeting =====
  const clockEl = document.getElementById("clock");
  const dateEl  = document.getElementById("date");
  const greetEl = document.getElementById("greetingText");

  function updateGreeting() {
    const h = new Date().getHours();
    const key = h>=5&&h<12 ? "greeting.morning"
               :h>=12&&h<18? "greeting.afternoon"
               :h>=18&&h<22? "greeting.evening"
               :              "greeting.night";
    greetEl.textContent = t(key);
    dateEl.textContent = new Intl.DateTimeFormat(locales[lang],
      {weekday:"long",year:"numeric",month:"long",day:"numeric"}).format(new Date());
  }

  function tick() {
    const n = new Date();
    const s = `${String(n.getHours()).padStart(2,"0")}:${String(n.getMinutes()).padStart(2,"0")}:${String(n.getSeconds()).padStart(2,"0")}`;
    if (clockEl.textContent !== s) {
      clockEl.textContent = s;
      updateGreeting();
    }
  }
  tick();
  setInterval(tick, 1000);

  // ===== Custom Name =====
  const nameDisplay = document.getElementById("nameDisplay");
  const nameEdit    = document.getElementById("nameEdit");
  const nameInput   = document.getElementById("nameInput");
  const nameEditBtn = document.getElementById("nameEditBtn");
  let customName = store.get("dashboard.name", "");

  function showName() {
    if (customName) {
      nameDisplay.textContent = ", " + customName;
      nameEditBtn.classList.add("hidden");
    } else {
      nameDisplay.textContent = "";
      nameEditBtn.classList.remove("hidden");
    }
  }
  showName();

  function openNameEdit() {
    nameEdit.classList.remove("hidden");
    nameInput.value = customName;
    nameInput.focus();
  }
  function closeNameEdit() { nameEdit.classList.add("hidden"); }
  function saveNameEdit() {
    const v = nameInput.value.trim().slice(0, 30);
    customName = v;
    store.set("dashboard.name", v);
    showName();
    closeNameEdit();
  }

  nameDisplay.addEventListener("click", openNameEdit);
  nameEditBtn.addEventListener("click", openNameEdit);
  nameInput.addEventListener("keydown", e => {
    if (e.key === "Enter") { e.preventDefault(); saveNameEdit(); }
    if (e.key === "Escape") { e.preventDefault(); closeNameEdit(); }
  });
  nameInput.addEventListener("blur", () => setTimeout(closeNameEdit, 150));

  // ===== Timer =====
  const timerDisplay  = document.getElementById("timerDisplay");
  const startStopBtn  = document.getElementById("startStopBtn");
  const resetBtn      = document.getElementById("resetBtn");
  const durDisplay    = document.getElementById("durationDisplay");
  const decBtn        = document.getElementById("decDuration");
  const incBtn        = document.getElementById("incDuration");
  const presetBtns    = document.querySelectorAll(".preset-btn");

  let duration = store.get("dashboard.duration", 25);
  let endTime  = null;
  let tInterval = null;
  let running  = false;

  function pad2(n) { return String(n).padStart(2,"0"); }
  function fmtTime(ms) {
    const total = Math.max(0, Math.ceil(ms / 1000));
    return `${pad2(Math.floor(total/60))}:${pad2(total%60)}`;
  }
  function setTimerText(txt) {
    if (timerDisplay.textContent !== txt) timerDisplay.textContent = txt;
  }
  function setDurationControls(on) {
    decBtn.disabled = !on;
    incBtn.disabled = !on;
    presetBtns.forEach(b => b.disabled = !on);
  }
  function refreshDurDisplay() {
    durDisplay.textContent = `${duration} min`;
    if (!running) setTimerText(`${pad2(duration)}:00`);
  }
  refreshDurDisplay();

  function startTimer() {
    if (running) return;
    running = true;
    const cur = timerDisplay.textContent;
    const [m, s] = cur.split(":").map(Number);
    endTime = Date.now() + (m * 60 + s) * 1000;
    startStopBtn.textContent = t("timer.stop");
    setDurationControls(false);
    tInterval = setInterval(() => {
      const rem = endTime - Date.now();
      setTimerText(fmtTime(rem));
      document.title = fmtTime(rem) + " – Life Dashboard";
      if (rem <= 0) { stopTimer(); timerDisplay.classList.add("pulse"); setTimeout(() => timerDisplay.classList.remove("pulse"), 600); }
    }, 250);
  }
  function stopTimer() {
    running = false;
    clearInterval(tInterval); tInterval = null;
    startStopBtn.textContent = t("timer.start");
    setDurationControls(true);
    document.title = "Life Dashboard";
  }

  startStopBtn.addEventListener("click", () => running ? stopTimer() : startTimer());
  resetBtn.addEventListener("click", () => { stopTimer(); refreshDurDisplay(); });
  decBtn.addEventListener("click", () => { if(duration>1){duration--;store.set("dashboard.duration",duration);refreshDurDisplay();} });
  incBtn.addEventListener("click", () => { if(duration<120){duration++;store.set("dashboard.duration",duration);refreshDurDisplay();} });
  presetBtns.forEach(b => b.addEventListener("click", () => {
    duration = parseInt(b.dataset.preset);
    store.set("dashboard.duration", duration);
    refreshDurDisplay();
  }));

  // ===== Tasks =====
  const taskInput  = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList   = document.getElementById("taskList");
  const emptyState = document.getElementById("emptyState");

  let tasks = store.get("dashboard.tasks", []);
  function saveTasks() { store.set("dashboard.tasks", tasks); }

  // ===== Progress Bar =====
  const progressWrap  = document.getElementById("progressWrap");
  const progressFill  = document.getElementById("progressFill");
  const progressTrack = document.getElementById("progressTrack");
  const progressText  = document.getElementById("progressText");
  const progressPct   = document.getElementById("progressPct");

  function updateProgress() {
    const total = tasks.length;
    const done  = tasks.filter(t2 => t2.done).length;
    if (total === 0) { progressWrap.classList.add("hidden"); return; }
    progressWrap.classList.remove("hidden");
    const pct = Math.round(done / total * 100);
    // text via i18n template: "{done} of {total} done"
    const tmpl = t("tasks.progress"); // "5 of 10 done"
    progressText.textContent = tmpl
      .replace("{done}", done)
      .replace("{total}", total);
    progressPct.textContent = pct + "%";
    progressFill.style.transform = "scaleX(" + (pct / 100) + ")";
    progressTrack.setAttribute("aria-valuenow", pct);
    if (pct === 100) { progressFill.classList.add("complete"); }
    else             { progressFill.classList.remove("complete"); }
  }

  function renderTasks() {
    taskList.innerHTML = "";
    if (!tasks.length) { emptyState.classList.remove("hidden"); updateProgress(); return; }
    emptyState.classList.add("hidden");
    tasks.forEach(task => {
      const li = document.createElement("li");
      li.className = "task-item" + (task.done ? " done" : "");
      li.dataset.id = task.id;

      const cb = document.createElement("button");
      cb.className = "task-checkbox";
      cb.setAttribute("aria-label", task.done ? t("tasks.delete") : t("tasks.add"));
      cb.setAttribute("aria-pressed", String(task.done));
      cb.type = "button";

      const txt = document.createElement("span");
      txt.className = "task-text";
      txt.textContent = task.text;

      const del = document.createElement("button");
      del.className = "task-delete";
      del.type = "button";
      del.setAttribute("aria-label", t("tasks.delete"));
      del.textContent = "×";

      li.append(cb, txt, del);
      taskList.appendChild(li);
    });
    updateProgress();
  }

  function addTask(text) {
    const v = text.trim();
    if (!v) return;
    tasks.push({ id: Date.now().toString(), text: v, done: false, createdAt: Date.now() });
    saveTasks(); renderTasks(); taskInput.value = "";
  }
  function toggleTask(id) {
    const t2 = tasks.find(t3 => t3.id === id);
    if (!t2) return;
    // bounce the checkbox before re-render
    const cb = taskList.querySelector(`[data-id="${id}"] .task-checkbox`);
    if (cb) {
      cb.classList.remove("bounce");
      void cb.offsetWidth; // reflow to restart animation
      cb.classList.add("bounce");
    }
    t2.done = !t2.done;
    saveTasks();
    setTimeout(renderTasks, 80); // small delay so bounce is visible
  }
  function deleteTask(id) {
    const el = taskList.querySelector(`[data-id="${id}"]`);
    if (el) {
      el.classList.add("removing");
      setTimeout(() => { tasks = tasks.filter(t2 => t2.id !== id); saveTasks(); renderTasks(); }, 200);
    }
  }

  addTaskBtn.addEventListener("click", () => addTask(taskInput.value));
  taskInput.addEventListener("keydown", e => { if (e.key==="Enter"){ e.preventDefault(); addTask(taskInput.value); }});

  taskList.addEventListener("click", e => {
    const li = e.target.closest(".task-item");
    if (!li) return;
    const id = li.dataset.id;
    if (e.target.classList.contains("task-checkbox")) { toggleTask(id); }
    else if (e.target.classList.contains("task-delete")) { deleteTask(id); }
    else if (e.target.classList.contains("task-text")) {
      // inline edit
      const span = e.target;
      const original = span.textContent;
      const inp = document.createElement("input");
      inp.type = "text";
      inp.className = "task-edit-input";
      inp.value = original;
      span.replaceWith(inp);
      inp.focus(); inp.select();
      let saved = false;
      function commit() {
        if (saved) return; saved = true;
        const v = inp.value.trim();
        if (v && v !== original) {
          const t2 = tasks.find(t3 => t3.id === id);
          if (t2) { t2.text = v; saveTasks(); }
        }
        renderTasks();
      }
      function cancel() { if (saved) return; saved = true; renderTasks(); }
      inp.addEventListener("keydown", e2 => {
        if (e2.key === "Enter")  { e2.preventDefault(); commit(); }
        if (e2.key === "Escape") { e2.preventDefault(); cancel(); }
      });
      inp.addEventListener("blur", commit);
    }
  });

  renderTasks();

  // ===== Quick Links =====
  const linkNameEl = document.getElementById("linkName");
  const linkUrlEl  = document.getElementById("linkUrl");
  const addLinkBtn = document.getElementById("addLinkBtn");
  const linksDiv   = document.getElementById("linksList");

  let links = store.get("dashboard.links", null);
  if (links === null) {
    links = [
      { id:"l1", name:"Google",   url:"https://www.google.com" },
      { id:"l2", name:"Gmail",    url:"https://mail.google.com" },
      { id:"l3", name:"Calendar", url:"https://calendar.google.com" }
    ];
    store.set("dashboard.links", links);
  }
  function saveLinks() { store.set("dashboard.links", links); }

  function renderLinks() {
    linksDiv.innerHTML = "";
    links.forEach(lnk => {
      const chip = document.createElement("div");
      chip.className = "link-chip";
      const a = document.createElement("a");
      a.href = lnk.url; a.target = "_blank"; a.rel = "noopener noreferrer";
      a.textContent = lnk.name;
      const rm = document.createElement("button");
      rm.className = "link-chip-remove";
      rm.type = "button";
      rm.setAttribute("aria-label", t("links.remove"));
      rm.textContent = "×";
      rm.addEventListener("click", () => { links = links.filter(l => l.id !== lnk.id); saveLinks(); renderLinks(); });
      chip.append(a, rm);
      linksDiv.appendChild(chip);
    });
  }

  function addLink(name, url) {
    const n = name.trim(), u = url.trim();
    if (!n || !u) return;
    let finalUrl = u.match(/^https?:\/\//i) ? u : "https://" + u;
    try { new URL(finalUrl); } catch { return; }
    links.push({ id: Date.now().toString(), name: n, url: finalUrl });
    saveLinks(); renderLinks();
    linkNameEl.value = ""; linkUrlEl.value = "";
  }

  addLinkBtn.addEventListener("click", () => addLink(linkNameEl.value, linkUrlEl.value));
  linkNameEl.addEventListener("keydown", e => { if (e.key==="Enter"){ e.preventDefault(); linkUrlEl.focus(); }});
  linkUrlEl.addEventListener("keydown",  e => { if (e.key==="Enter"){ e.preventDefault(); addLink(linkNameEl.value, linkUrlEl.value); }});

  renderLinks();

  // ===== Apply language last (after render) =====
  applyLanguage(lang);

})();