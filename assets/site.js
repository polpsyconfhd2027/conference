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

  const registrationLink = document.querySelector("[data-registration-link]");
  if (
    registrationLink &&
    window.siteConfig &&
    window.siteConfig.registrationUrl &&
    window.siteConfig.registrationUrl !== "#"
  ) {
    registrationLink.href = window.siteConfig.registrationUrl;
    registrationLink.textContent = window.siteConfig.registrationLabel;
    registrationLink.target = "_blank";
    registrationLink.rel = "noreferrer";
  }
})();
