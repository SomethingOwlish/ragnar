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

  /* --- тема --- */
  function pageDefault() {
    return document.documentElement.getAttribute("data-default-theme") || "dark";
  }
  function current() {
    try { return localStorage.getItem(KEY) || pageDefault(); }
    catch (e) { return pageDefault(); }
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
    var next = theme === "dark" ? "светлая" : "тёмная";
    var ico = theme === "dark" ? "☾" : "☀";
    document.querySelectorAll(".theme-toggle").forEach(function (b) {
      b.querySelector(".tt-ico").textContent = ico;
      b.querySelector(".tt-lbl").textContent = next + " тема";
      b.setAttribute("title", "Переключить на " + next + " тему");
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
    tree:   { label: "Древо судеб",       rune: "ᛏ", href: "divine-tree.html" },
    worlds: { label: "Девять миров",      rune: "ᛃ" },
    chars:  { label: "Граф богов",        rune: "ᚷ" },
    runes:  { label: "Руны",              rune: "ᚠ" },
    chrono: { label: "Хронология",        rune: "ᛞ" },
    blog:   { label: "Блог",              rune: "ᚨ" },
  };

  var NAV = {
    player: ["portal", "sheet", "tree", "worlds", "chars", "runes", "chrono", "blog"],
    gm:     ["portal", "panel", "tree", "worlds", "chars", "runes", "chrono", "blog"],
    portal: [],
  };

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
    if (key === "tree")   return "divine-tree.html?role=" + role + cp;
    if (key === "worlds") return "nine-worlds.html?role=" + role + cp;
    if (key === "chars")  return "characters.html?role=" + role + cp;
    if (key === "runes")  return "runes.html?role=" + role + cp;
    if (key === "chrono") return "chronology.html?role=" + role + cp;
    if (key === "blog")   return "blog.html?role=" + role + cp;
    return it.href;
  }

  function isPlayerAuthed() {
    try { return !!localStorage.getItem("ragnarok-current"); } catch (e) { return false; }
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

    // навигация
    var keys = (NAV[role] || []).filter(function (k) {
      if (ITEMS[k].gm && role !== "gm") return false;                 // gm-пункты только ведущей
      // у игрока вкладки (кроме портала и своей карты) показываем только после входа в карту
      if (role === "player" && (k === "tree" || k === "worlds" || k === "chars" || k === "runes" || k === "chrono" || k === "blog") && !isPlayerAuthed()) return false;
      return true;
    });
    if (keys.length) {
      var nav = document.createElement("nav");
      nav.className = "shell-nav";
      keys.forEach(function (k) {
        var it = ITEMS[k];
        var isHere = k === here;
        var cls = "shell-link" + (it.gm ? " gm" : "") + (isHere ? " here" : "");
        if (isHere) {
          var span = document.createElement("span");
          span.className = cls;
          span.innerHTML = '<span class="rune">' + it.rune + "</span>" + it.label;
          nav.appendChild(span);
        } else {
          var a = document.createElement("a");
          a.className = cls;
          a.href = hrefFor(k, role);
          a.innerHTML = '<span class="rune">' + it.rune + "</span>" + it.label;
          nav.appendChild(a);
        }
      });
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
      var cur = document.documentElement.getAttribute("data-theme") || current();
      setTheme(cur === "dark" ? "light" : "dark");
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

  function init() {
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
    if (e.key === KEY && e.newValue) {
      apply(e.newValue);
      refreshToggles(e.newValue);
    }
  });
})();
