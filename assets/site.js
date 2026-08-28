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
    },
    {
      selector: "[data-full-program-link]",
      url: config.fullProgramUrl,
      label: config.fullProgramLabel
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

  // Full program section (program.html): rendered from window.fullProgramData.
  const fullProgramData = window.fullProgramData;
  const fullProgramDays = document.getElementById("full-program-days");
  const fullProgramStatus = document.getElementById("full-program-status");
  const fullProgramDownload = document.getElementById("download-full-program");

  if (fullProgramData && fullProgramDays && fullProgramStatus) {
    const escapeHtml = (value) =>
      String(value).replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[char]);

    const renderTalk = (talk) => `
      <article class="program-session full-program-session">
        <div class="program-time">${escapeHtml(talk.time)}</div>
        <div>
          <h4 class="program-title">${escapeHtml(talk.title)}</h4>
          ${talk.authors && talk.authors.length ? `<p class="program-meta">${talk.authors.map(escapeHtml).join(", ")}</p>` : ""}
          ${talk.abstract ? `<p class="program-description">${escapeHtml(talk.abstract)}</p>` : ""}
          ${talk.tags && talk.tags.length ? `<div class="program-tags">${talk.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>` : ""}
        </div>
      </article>
    `;

    const renderBlock = (block) => `
      <article class="program-session full-program-session">
        <div class="program-time">${escapeHtml(block.time)}</div>
        <div>
          <h4 class="program-title">${escapeHtml(block.title)}</h4>
          ${block.roomOrFormat ? `<p class="program-meta">${escapeHtml(block.roomOrFormat)}</p>` : ""}
          ${block.authors && block.authors.length ? `<p class="program-meta">${block.authors.map(escapeHtml).join(", ")}</p>` : ""}
          ${block.abstract ? `<p class="program-description">${escapeHtml(block.abstract)}</p>` : ""}
          ${block.tags && block.tags.length ? `<div class="program-tags">${block.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>` : ""}
        </div>
      </article>
    `;

    const hasContent = fullProgramData.published && Array.isArray(fullProgramData.days) && fullProgramData.days.length > 0;

    if (hasContent) {
      fullProgramDays.innerHTML = fullProgramData.days
        .map((day) => `
          <section class="program-day">
            <div class="program-day-header">
              <h3>${escapeHtml(day.title)}</h3>
              <p class="program-day-date">${escapeHtml(day.date || "")}</p>
            </div>
            <div class="program-session-list">
              ${(day.blocks || []).map(renderBlock).join("")}
              ${(day.talks || []).map(renderTalk).join("")}
            </div>
          </section>
        `)
        .join("");

      fullProgramDays.hidden = false;

      if (fullProgramData.note) {
        fullProgramStatus.textContent = fullProgramData.note;
      } else {
        fullProgramStatus.hidden = true;
      }

      if (fullProgramDownload && config.fullProgramUrl) {
        fullProgramDownload.hidden = false;
      }
    } else {
      if (fullProgramData.note) {
        fullProgramStatus.textContent = fullProgramData.note;
      }
      if (fullProgramDownload) {
        fullProgramDownload.hidden = false;
      }
    }
  }
})();
