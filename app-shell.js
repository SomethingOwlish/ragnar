/* ============================================================
   Рагнарёк-AU · оболочка
   - тема: выбор в localStorage('ragnarok-theme') перекрывает дефолт
     страницы (data-default-theme) и применяется на всех страницах;
   - верхняя полоса: навигация между кабинетами под нужную роль.

   Доступ зашит в ссылках: ?role=player не даёт переключиться на
   режим ведущей — целевая страница берёт роль из адреса и блокирует.
   Игроку вкладка полного древа не показывается вовсе.

   Подключение на странице:
     <html data-default-theme="dark">                  (или "light")
     <header data-shell data-role="player" data-here="sheet"></header>
     <script src="app-shell.js" defer></script>
   role: "player" | "gm" | "portal"
   ============================================================ */
(function () {
  var KEY = "ragnarok-theme";

  /* --- тема ---
     Три темы по кругу: dark → light → skog → dark. Подпись/иконка
     кнопки показывают ТЕКУЩУЮ тему; клик переводит на следующую. */
  var THEMES = ["dark", "light", "skog"];
  var THEME_META = {
    dark:  { label: "Polar Night", icon: "☽" },  // ☽ месяц
    light: { label: "Snow Storm",  icon: "☀" },  // ☀ солнце
    skog:  { label: "Skog · Лес",  icon: "⚘" },  // ⚘ цветок
  };
  function isTheme(t) { return THEMES.indexOf(t) >= 0; }
  function nextTheme(t) { return THEMES[(THEMES.indexOf(t) + 1) % THEMES.length]; }

  function pageDefault() {
    var d = document.documentElement.getAttribute("data-default-theme");
    return isTheme(d) ? d : "dark";        // дефолт вне списка → dark
  }
  function current() {
    try {
      var saved = localStorage.getItem(KEY);
      if (isTheme(saved)) return saved;    // сохранённое вне списка → откат на дефолт
    } catch (e) {}
    return pageDefault();
  }
  function apply(theme) {
    document.documentElement.setAttribute("data-theme", theme);
  }
  function setTheme(theme) {
    apply(theme);
    try { localStorage.setItem(KEY, theme); } catch (e) {}
    refreshToggles(theme);
  }
  function refreshToggles(theme) {
    var t = isTheme(theme) ? theme : current();
    var meta = THEME_META[t];
    var nx = THEME_META[nextTheme(t)];
    var hint = "Тема: " + meta.label + " — переключить на «" + nx.label + "»";
    document.querySelectorAll(".theme-toggle").forEach(function (b) {
      b.querySelector(".tt-ico").textContent = meta.icon;
      b.querySelector(".tt-lbl").textContent = meta.label;
      b.setAttribute("title", hint);
      b.setAttribute("aria-label", hint);
    });
  }

  // применяем тему как можно раньше (на случай, если inline-скрипта в <head> нет)
  apply(current());

  /* --- навигация по ролям --- */
  // gm:true → пункт только для ведущей (игроку не показывается)
  var ITEMS = {
    portal: { label: "Портал",          rune: "ᛈ", href: "index.html" },
    sheet:  { label: "Карта героя",      rune: "ᛗ", href: "ragnarok-character-sheet-cloud.html" },
    panel:  { label: "Панель ведущей",   rune: "ᛟ", href: "ragnarok-gm-panel.html", gm: true },
    init:   { label: "Инициатива",        rune: "ᛁ" },
    tree:   { label: "Древо судеб",       rune: "ᛏ", href: "divine-tree.html" },
    worlds: { label: "Девять миров",      rune: "ᛃ" },
    chars:  { label: "Граф богов",        rune: "ᚷ" },
    runes:  { label: "Руны",              rune: "ᚠ" },
    chrono: { label: "Хронология",        rune: "ᛞ" },
    blog:   { label: "Блог",              rune: "ᚨ", href: "blog.html" },
    woy:    { label: "Колесо года",        rune: "ᛊ" },
    library:{ label: "Библиотека",        rune: "ᛦ" },
    npc:    { label: "Статблоки",          rune: "ᚦ", gm: true },
    names:  { label: "Имена",              rune: "ᛗ", gm: true },
    maps:   { label: "Карты и планы",      rune: "ᛚ", gm: true },
    mcodex: { label: "Кодекс мастера",     rune: "ᛒ", gm: true },
    spot:   { label: "Спотлайт",           rune: "ᛉ", gm: true },
  };

  var NAV = {
    player: ["portal", "sheet", "init", "tree", "worlds", "chars", "runes", "chrono", "blog", "woy", "library"],
    gm:     ["portal", "panel", "init", "tree", "worlds", "chars", "runes", "chrono", "blog", "woy", "library", "names", "npc", "maps", "mcodex", "spot"],
    portal: [],
  };

  // первый ряд (всегда плоско, вне групп) — для каждой роли
  var PRIMARY = {
    player: ["portal", "sheet"],
    gm:     ["portal", "panel"],
    portal: [],
  };
  // остальное прячем во вложенные выпадашки, чтобы шапка не раздувалась
  var GROUPS = [
    { id: "codex", label: "Кодекс",     rune: "ᛜ", keys: ["init", "tree", "worlds", "chars", "runes", "chrono", "blog", "woy", "library"] },
    { id: "forge", label: "Мастерская", rune: "ᚦ", gm: true, keys: ["names", "npc", "maps", "mcodex", "spot"] },
  ];

  function campaignParam() {
    try {
      var cur = JSON.parse(localStorage.getItem("ragnarok-current") || "null");
      if (cur && cur.campaign) return "&c=" + encodeURIComponent(cur.campaign);
      var c = localStorage.getItem("ragnarok-board-campaign") || localStorage.getItem("ragnarok-campaign");
      if (c) return "&c=" + encodeURIComponent(c);
    } catch (e) {}
    return "";
  }
  function hrefFor(key, role) {
    var it = ITEMS[key];
    var cp = campaignParam();
    if (key === "init")   return "initiative.html?role=" + role + cp;
    if (key === "tree")   return "divine-tree.html?role=" + role + cp;
    if (key === "worlds") return "nine-worlds.html?role=" + role + cp;
    if (key === "chars")  return "characters.html?role=" + role + cp;
    if (key === "runes")  return "runes.html?role=" + role + cp;
    if (key === "chrono") return "chronology.html?role=" + role + cp;
    if (key === "blog")   return "blog.html?role=" + role + cp;
    if (key === "woy")    return "wheel-of-year.html?role=" + role + cp;
    if (key === "library") return "library.html?role=" + role + cp;
    if (key === "npc")    return "npc-gen.html?role=" + role + cp;
    if (key === "names")  return "name-gen.html?role=" + role + cp;
    if (key === "maps")   return "maps-plans.html?role=" + role + cp;
    if (key === "mcodex") return "codex.html?role=" + role + cp;
    if (key === "spot")   return "spotlight.html?role=" + role + cp;
    return it.href;
  }

  function isPlayerAuthed() {
    try { return !!localStorage.getItem("ragnarok-current"); } catch (e) { return false; }
  }

  /* --- меню: вложенные группы + бургер на узких экранах --- */
  function closeAllMenus() {
    document.querySelectorAll(".shell-group.open").forEach(function (g) { g.classList.remove("open"); });
  }
  function closeBurger() {
    document.querySelectorAll(".shell.nav-open").forEach(function (s) { s.classList.remove("nav-open"); });
  }
  var shellGlobalBound = false;
  function bindShellGlobal() {
    if (shellGlobalBound) return;
    shellGlobalBound = true;
    document.addEventListener("click", function (ev) {
      var inShell = ev.target.closest && ev.target.closest(".shell");
      if (!inShell) { closeAllMenus(); closeBurger(); return; }
      // клик внутри шапки, но не по группе — закрываем раскрытые выпадашки
      if (!(ev.target.closest && ev.target.closest(".shell-group"))) closeAllMenus();
    });
    window.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeAllMenus(); closeBurger(); } });
  }

  // одиночная ссылка/метка текущей страницы
  function makeLink(key, role, here) {
    var it = ITEMS[key];
    var isHere = key === here;
    var el;
    if (isHere) { el = document.createElement("span"); }
    else { el = document.createElement("a"); el.href = hrefFor(key, role); }
    el.className = "shell-link" + (it.gm ? " gm" : "") + (isHere ? " here" : "");
    el.innerHTML = '<span class="rune">' + it.rune + "</span>" + it.label;
    return el;
  }
  // выпадающая группа; visible(k) решает, показывать ли пункт
  function makeGroup(g, role, here, visible) {
    var keys = g.keys.filter(visible);
    if (!keys.length) return null;
    var wrap = document.createElement("div");
    wrap.className = "shell-group";
    var hasHere = keys.indexOf(here) >= 0;

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "shell-gbtn" + (g.gm ? " gm" : "") + (hasHere ? " has-here" : "");
    btn.innerHTML = '<span class="rune">' + g.rune + "</span>" + g.label + '<span class="caret">\u25be</span>';
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var wasOpen = wrap.classList.contains("open");
      closeAllMenus();
      if (!wasOpen) {
        wrap.classList.add("open");
        // если панель упирается в правый край окна — раскрываем её влево
        wrap.classList.remove("flip");
        var r = menu.getBoundingClientRect();
        if (r.right > window.innerWidth - 8) wrap.classList.add("flip");
      }
    });

    var menu = document.createElement("div");
    menu.className = "shell-gmenu";
    keys.forEach(function (k) { menu.appendChild(makeLink(k, role, here)); });

    wrap.appendChild(btn);
    wrap.appendChild(menu);
    return wrap;
  }

  function buildShell(host) {
    var role = host.getAttribute("data-role") || "portal";
    var here = host.getAttribute("data-here") || "";
    var isGM = role === "gm";

    host.className = "shell";
    host.innerHTML = "";

    // бренд
    var brand = document.createElement("div");
    brand.className = "shell-brand " + (isGM ? "gm" : "player");
    brand.innerHTML = '<span class="rune">' + (isGM ? "ᛟ" : "ᛈ") + '</span> Рагнарёк-AU';
    host.appendChild(brand);

    // что вообще доступно этой роли (с учётом гейтов)
    function visible(k) {
      if ((NAV[role] || []).indexOf(k) < 0) return false;             // только пункты этой роли
      if (ITEMS[k].gm && role !== "gm") return false;                 // gm-пункты только ведущей
      // у игрока вкладки кодекса (кроме портала, карты и колеса) — только после входа в карту
      if (role === "player" && (k === "tree" || k === "worlds" || k === "chars" || k === "runes" || k === "chrono" || k === "blog") && !isPlayerAuthed()) return false;
      return true;
    }

    var primaryKeys = (PRIMARY[role] || []).filter(visible);
    var groupNodes = GROUPS
      .filter(function (g) { return !g.gm || isGM; })
      .map(function (g) { return makeGroup(g, role, here, visible); })
      .filter(Boolean);

    if (primaryKeys.length || groupNodes.length) {
      // бургер (виден только на узких экранах через CSS)
      var burger = document.createElement("button");
      burger.type = "button";
      burger.className = "shell-burger";
      burger.setAttribute("aria-label", "Меню");
      burger.innerHTML = '<span class="bg-ico">\u2630</span><span class="bg-lbl">Меню</span>';
      burger.addEventListener("click", function (e) {
        e.stopPropagation();
        closeAllMenus();
        host.classList.toggle("nav-open");
      });
      host.appendChild(burger);

      var nav = document.createElement("nav");
      nav.className = "shell-nav";
      primaryKeys.forEach(function (k) { nav.appendChild(makeLink(k, role, here)); });
      groupNodes.forEach(function (g) { nav.appendChild(g); });
      host.appendChild(nav);
    }

    // распорка
    var sp = document.createElement("div");
    sp.className = "shell-spacer";
    host.appendChild(sp);

    // метка роли (кроме портала)
    if (role !== "portal") {
      var tag = document.createElement("span");
      tag.className = "shell-role " + (isGM ? "gm" : "player");
      tag.textContent = isGM ? "ведущая" : "игрок";
      host.appendChild(tag);
    }

    // переключатель темы
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "theme-toggle";
    btn.innerHTML = '<span class="tt-ico"></span><span class="tt-lbl"></span>';
    btn.addEventListener("click", function () {
      var cur = document.documentElement.getAttribute("data-theme");
      if (!isTheme(cur)) cur = current();
      setTheme(nextTheme(cur));
    });
    host.appendChild(btn);
  }

  function buildAll() {
    document.querySelectorAll("[data-shell]").forEach(buildShell);
    refreshToggles(document.documentElement.getAttribute("data-theme") || current());
    publishShellH();
  }

  /* --- высота шапки → --shell-h ---
     Сайдбары досок фиксируются под шапкой. На мобиле навигация
     переносится в несколько строк, и шапка выше дефолтных 64px —
     поэтому отдаём реальную высоту, чтобы верх сайдбара (и крестик)
     не уезжал под шапку (BUG-10). */
  function publishShellH() {
    var sh = document.querySelector(".shell");
    var h = sh ? Math.round(sh.getBoundingClientRect().height) : 64;
    document.documentElement.style.setProperty("--shell-h", h + "px");
  }

  /* --- тап-тултипы (BUG-11) ---
     На наведении подсказки работали только мышью. На касании
     показываем плавающий пузырь из data-tip / title по тапу;
     повторный тап или тап мимо — скрывает. Включаем только на
     сенсорных устройствах, чтобы не мешать ховеру на десктопе. */
  function initTapTips() {
    var touch = ("ontouchstart" in window) || (navigator.maxTouchPoints || 0) > 0;
    if (!touch) return;
    var tip = document.createElement("div");
    tip.className = "tap-tip";
    tip.style.display = "none";
    document.body.appendChild(tip);
    var hideT = null, curEl = null;
    function place(el) {
      var r = el.getBoundingClientRect();
      tip.style.display = "block";
      var bw = tip.offsetWidth, bh = tip.offsetHeight;
      var left = r.left + r.width / 2 - bw / 2;
      left = Math.max(8, Math.min(left, window.innerWidth - bw - 8));
      var top = r.top - bh - 10;
      if (top < 8) top = r.bottom + 10;
      tip.style.left = left + "px";
      tip.style.top = top + "px";
    }
    function show(el) {
      var txt = el.getAttribute("data-tip") || el.getAttribute("title");
      if (!txt) return;
      curEl = el; tip.textContent = txt; place(el);
      clearTimeout(hideT); hideT = setTimeout(hide, 3600);
    }
    function hide() { tip.style.display = "none"; curEl = null; }
    document.addEventListener("click", function (e) {
      var t = e.target;
      var el = t && t.closest ? t.closest("[data-tip],.tip,[title]") : null;
      if (el && (el.getAttribute("data-tip") || el.getAttribute("title"))) {
        if (el === curEl && tip.style.display === "block") { hide(); return; }
        show(el);
      } else { hide(); }
    }, true);
    window.addEventListener("scroll", hide, true);
    window.addEventListener("resize", hide);
  }

  /* стили вложенного меню/бургера держим в самом shell — чтобы новая
     навигация работала даже без правки theme.css */
  function injectMenuCSS() {
    if (document.getElementById("shell-menu-css")) return;
    var css = [
      ".shell{ position:sticky; }",
      ".shell-nav{ position:relative; min-width:0; max-width:100%; }",
      ".shell-group{ position:relative; }",
      ".shell-gbtn{ display:inline-flex; align-items:center; gap:7px; cursor:pointer; background:var(--surf); border:1px solid var(--line); color:var(--ink); border-radius:8px; padding:6px 12px; font-size:12.5px; letter-spacing:.02em; font-family:var(--sans); }",
      ".shell-gbtn .rune{ font-family:var(--rune); font-size:14px; color:var(--faint); line-height:1; }",
      ".shell-gbtn .caret{ font-size:10px; color:var(--faint); transition:transform .15s; }",
      ".shell-group.open .shell-gbtn .caret{ transform:rotate(180deg); }",
      ".shell-gbtn:hover{ border-color:var(--steel-soft); color:var(--steel); }",
      ".shell-gbtn:hover .rune{ color:var(--steel); }",
      ".shell-gbtn.has-here{ background:var(--surf2); border-color:var(--steel-soft); color:var(--steel); }",
      ".shell-gbtn.has-here .rune{ color:var(--steel); }",
      ".shell-gbtn.gm:hover, .shell-gbtn.gm.has-here{ border-color:var(--line-warm); color:var(--bronze); }",
      ".shell-gbtn.gm:hover .rune, .shell-gbtn.gm.has-here .rune{ color:var(--bronze); }",
      ".shell-gmenu{ display:none; position:absolute; top:calc(100% + 6px); left:0; z-index:60; flex-direction:column; gap:6px; min-width:194px; padding:8px; background:var(--surf); border:1px solid var(--line); border-radius:10px; box-shadow:0 14px 34px -12px rgba(0,0,0,.55); }",
      ".shell-group.open .shell-gmenu{ display:flex; }",
      ".shell-group.flip .shell-gmenu{ left:auto; right:0; }",
      ".shell-gmenu .shell-link{ width:100%; }",
      ".shell-burger{ display:none; align-items:center; gap:8px; cursor:pointer; background:var(--surf); border:1px solid var(--line); color:var(--ink); border-radius:8px; padding:6px 12px; font-size:13px; font-family:var(--sans); }",
      ".shell-burger:hover{ border-color:var(--steel-soft); color:var(--steel); }",
      ".shell-burger .bg-ico{ font-size:15px; line-height:1; }",
      "@media (max-width:900px){",
      "  .shell-burger{ display:inline-flex; }",
      "  .shell-nav{ display:none; position:absolute; top:100%; left:0; right:0; z-index:55; flex-direction:column; align-items:stretch; gap:8px; padding:12px; margin:0; background:color-mix(in srgb, var(--bg) 96%, var(--surf)); border-bottom:1px solid var(--line); box-shadow:0 18px 34px -16px rgba(0,0,0,.6); }",
      "  .shell.nav-open .shell-nav{ display:flex; }",
      "  .shell-nav > .shell-link{ width:100%; }",
      "  .shell-group{ display:flex; flex-direction:column; gap:6px; }",
      "  .shell-gbtn{ pointer-events:none; background:transparent; border:none; padding:4px 2px; color:var(--faint); font-size:11px; letter-spacing:.14em; text-transform:uppercase; }",
      "  .shell-gbtn .caret{ display:none; }",
      "  .shell-gmenu{ display:flex !important; position:static; box-shadow:none; border:none; background:transparent; padding:2px 0 2px 8px; min-width:0; }",
      "}",
      "@media print{ .shell-burger, .shell-gmenu{ display:none !important; } }"
    ].join("\n");
    var st = document.createElement("style");
    st.id = "shell-menu-css";
    st.textContent = css;
    document.head.appendChild(st);
  }

  /* --- декоративные скандинавские паттерны (общий слой) ---
     Вставляем один фиксированный слой ЗА контентом: розетка
     åttebladrose (водяной знак), зерно и полоса ельника внизу.
     Слой aria-hidden, не ловит клики, красится токенами темы
     (работает во всех трёх палитрах), скрыт при печати (CSS в
     theme.css). Страница может отписаться атрибутом data-no-deco
     на <html>/<body> — тогда слой не вставляем и фон не трогаем. */
  function injectDeco() {
    var root = document.documentElement;
    var off = root.hasAttribute("data-no-deco") ||
              (document.body && document.body.hasAttribute("data-no-deco"));
    if (off || document.getElementById("skog-deco")) return;
    root.classList.add("has-deco");
    var d = document.createElement("div");
    d.id = "skog-deco";
    d.className = "skog-deco";
    d.setAttribute("aria-hidden", "true");
    d.innerHTML =
      '<svg class="skog-deco__weave" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<defs>' +
          '<pattern id="skog-rose" width="72" height="72" patternUnits="userSpaceOnUse">' +
            '<g fill="none" stroke="currentColor" stroke-width="1.4">' +
              '<rect x="24" y="24" width="24" height="24"></rect>' +
              '<rect x="24" y="24" width="24" height="24" transform="rotate(45 36 36)"></rect>' +
              '<path d="M36 6 L40 32 L36 36 L32 32 Z" fill="currentColor" stroke="none"></path>' +
              '<path d="M36 66 L40 40 L36 36 L32 40 Z" fill="currentColor" stroke="none"></path>' +
              '<path d="M6 36 L32 32 L36 36 L32 40 Z" fill="currentColor" stroke="none"></path>' +
              '<path d="M66 36 L40 32 L36 36 L40 40 Z" fill="currentColor" stroke="none"></path>' +
            '</g>' +
          '</pattern>' +
        '</defs>' +
        '<rect width="100%" height="100%" fill="url(#skog-rose)"></rect>' +
      '</svg>' +
      '<div class="skog-deco__grain"></div>' +
      '<svg class="skog-deco__ridge" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 160" preserveAspectRatio="none" aria-hidden="true">' +
        '<path d="M0 160 L0 96 L40 118 L70 70 L100 118 L100 96 L140 116 L170 60 L200 116 L200 96 L245 120 L280 74 L315 120 L315 96 L360 118 L395 66 L430 118 L430 96 L480 122 L520 78 L560 122 L560 96 L610 118 L645 64 L680 118 L680 96 L730 120 L770 72 L810 120 L810 96 L860 118 L895 62 L930 118 L930 96 L980 122 L1020 78 L1060 122 L1060 96 L1110 118 L1145 68 L1180 118 L1200 100 L1200 160 Z" fill="currentColor"></path>' +
      '</svg>';
    document.body.insertBefore(d, document.body.firstChild);
  }

  function init() {
    injectMenuCSS();
    injectDeco();
    bindShellGlobal();
    buildAll();
    initTapTips();
    // следим за высотой шапки (перенос строк навигации, загрузка шрифтов)
    if (window.ResizeObserver) {
      var sh = document.querySelector(".shell");
      if (sh) new ResizeObserver(publishShellH).observe(sh);
    } else {
      window.addEventListener("resize", publishShellH);
    }
    // плавные переходы включаем после первой отрисовки (без мигания на загрузке)
    var raf = window.requestAnimationFrame || function (f) { return setTimeout(f, 0); };
    raf(function () {
      document.documentElement.classList.add("theme-ready");
    });
  }

  // карта героя шлёт это событие после входа/перевхода — пересобираем навигацию
  window.addEventListener("ragnarok:auth", buildAll);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // синхронизация между открытыми вкладками
  window.addEventListener("storage", function (e) {
    if (e.key === KEY && isTheme(e.newValue)) {
      apply(e.newValue);
      refreshToggles(e.newValue);
    }
  });
})();
