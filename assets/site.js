(function () {
  const page = document.body.dataset.page;
  const navLinks = document.querySelectorAll(".site-nav a");

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
