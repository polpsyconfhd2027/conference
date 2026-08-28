(function () {
  const page = document.body.dataset.page;
  const navLinks = document.querySelectorAll(".site-nav a");

  // Theme handling: default to the browser's color scheme, remember manual picks.
  const themeToggle = document.querySelector(".theme-toggle");
  if (themeToggle) {
    const query = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (theme, animate) => {
      if (!animate) {
        document.documentElement.classList.add("no-theme-transition");
      }
      document.documentElement.dataset.theme = theme;
      themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
      themeToggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      );
      themeToggle.setAttribute(
        "title",
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      );
      if (!animate) {
        // Force a style flush so the next change can transition.
        void document.documentElement.offsetWidth;
        document.documentElement.classList.remove("no-theme-transition");
      }
    };

    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark" || storedTheme === "light") {
      applyTheme(storedTheme, false);
    } else {
      applyTheme(query.matches ? "dark" : "light", false);
    }

    query.addEventListener("change", (event) => {
      const stored = localStorage.getItem("theme");
      if (stored !== "dark" && stored !== "light") {
        applyTheme(event.matches ? "dark" : "light", false);
      }
    });

    themeToggle.addEventListener("click", () => {
      const next =
        document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      localStorage.setItem("theme", next);
      applyTheme(next, true);
    });
  }

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (
      (page === "home" && href === "index.html") ||
      (page !== "home" && href && href.includes(page))
    ) {
      link.classList.add("is-active");
    }
  });

  const toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const isOpen = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  const config = window.siteConfig || {};

  [
    {
      selector: "[data-registration-link]",
      url: config.registrationUrl,
      label: config.registrationLabel
    },
    {
      selector: "[data-submission-link]",
      url: config.submissionSurveyUrl,
      label: config.submissionSurveyLabel
    }
  ].forEach((item) => {
    const link = document.querySelector(item.selector);
    if (!link) {
      return;
    }

    if (item.label) {
      link.textContent = item.label;
    }

    if (item.url && item.url !== "#") {
      link.href = item.url;
      link.target = "_blank";
      link.rel = "noreferrer";
    }
  });
})();
