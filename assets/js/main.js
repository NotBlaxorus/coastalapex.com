(function () {
  const root = document.documentElement;
  const THEME_STORAGE_KEY = "cav_theme";

  const readStorage = (key) => {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  };

  const writeStorage = (key, value) => {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      // Ignore storage failures (private mode, browser policy, etc.)
    }
  };

  const themeBtn = document.querySelector("[data-theme-toggle]");
  const themeIcon = themeBtn ? themeBtn.querySelector(".icon") : null;

  const syncThemeButton = (theme) => {
    if (!themeBtn) return;
    const isDark = theme === "dark";
    const action = isDark ? "Switch to light theme" : "Switch to dark theme";
    themeBtn.setAttribute("aria-pressed", String(isDark));
    themeBtn.setAttribute("aria-label", action);
    themeBtn.title = action;
    if (themeIcon) {
      themeIcon.textContent = isDark ? "◐" : "◑";
    }
  };

  const setTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    syncThemeButton(theme);
  };

  // Persisted theme
  const savedTheme = readStorage(THEME_STORAGE_KEY);
  if (savedTheme === "light" || savedTheme === "dark") {
    setTheme(savedTheme);
  } else {
    // default to dark (matches site mood)
    setTheme("dark");
  }

  // Theme toggle
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      setTheme(next);
      writeStorage(THEME_STORAGE_KEY, next);
    });
  }

  // Mobile nav
  const nav = document.querySelector("[data-nav]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  if (nav && navToggle) {
    const setNavOpen = (isOpen) => {
      nav.classList.toggle("is-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    };

    setNavOpen(false);

    navToggle.addEventListener("click", () => {
      setNavOpen(!nav.classList.contains("is-open"));
    });

    // Close on link click (mobile)
    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => setNavOpen(false));
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      const isClickInside = nav.contains(e.target) || navToggle.contains(e.target);
      if (!isClickInside) setNavOpen(false);
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setNavOpen(false);
    });

    // Ensure nav is reset when switching from mobile to desktop layout
    window.addEventListener("resize", () => {
      if (window.innerWidth > 860) setNavOpen(false);
    });
  }

  // Footer year
  const year = document.querySelectorAll("[data-year]");
  year.forEach((el) => (el.textContent = new Date().getFullYear()));

  // "Last updated" date on legal pages
  const today = document.querySelectorAll("[data-today]");
  today.forEach((el) => {
    el.textContent = new Date().toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  // Ventures filters
  const ventureGrid = document.querySelector("[data-venture-grid]");
  const chips = document.querySelectorAll("[data-filter]");
  if (ventureGrid && chips.length) {
    const cards = Array.from(ventureGrid.querySelectorAll("[data-type]"));
    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        chips.forEach((c) => c.classList.remove("is-active"));
        chip.classList.add("is-active");

        const filter = chip.getAttribute("data-filter");
        cards.forEach((card) => {
          const type = card.getAttribute("data-type");
          const show = filter === "all" || type === filter;
          card.hidden = !show;
          card.setAttribute("aria-hidden", String(!show));
        });
      });
    });
  }

  // Contact form -> mailto (no backend required)
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const name = (formData.get("name") || "").toString().trim();
      const email = (formData.get("email") || "").toString().trim();
      const topic = (formData.get("topic") || "").toString().trim();
      const message = (formData.get("message") || "").toString().trim();

      // Replace with your preferred inbox when ready
      const TO_EMAIL = "hello@coastalapexventures.com";

      const subject = encodeURIComponent(`[Coastal Apex Ventures] ${topic} — ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\nMessage:\n${message}\n`
      );

      window.location.href = `mailto:${TO_EMAIL}?subject=${subject}&body=${body}`;
    });
  }
})();
