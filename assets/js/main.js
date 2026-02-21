(function () {
  const root = document.documentElement;

  // Persisted theme
  const savedTheme = localStorage.getItem("cav_theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    root.setAttribute("data-theme", savedTheme);
  } else {
    // default to dark (matches site mood)
    root.setAttribute("data-theme", "dark");
  }

  // Theme toggle
  const themeBtn = document.querySelector("[data-theme-toggle]");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("cav_theme", next);
    });
  }

  // Mobile nav
  const nav = document.querySelector("[data-nav]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  if (nav && navToggle) {
    navToggle.addEventListener("click", () => {
      nav.classList.toggle("is-open");
      const isOpen = nav.classList.contains("is-open");
      navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    // Close on link click (mobile)
    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => nav.classList.remove("is-open"));
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      const isClickInside = nav.contains(e.target) || navToggle.contains(e.target);
      if (!isClickInside) nav.classList.remove("is-open");
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
          card.style.display = show ? "" : "none";
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