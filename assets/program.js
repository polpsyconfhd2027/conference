(function () {
  if (!window.programData) {
    return;
  }

  const daysContainer = document.getElementById("program-days");
  const printButton = document.getElementById("print-program");
  const days = Array.isArray(window.programData.days) ? window.programData.days : [];

  if (daysContainer) {
    daysContainer.innerHTML = days
      .map((day) => {
        const sessions = day.sessions
          .map((session) => {
            const tags = Array.isArray(session.tags) && session.tags.length
              ? `<div class="program-tags">${session.tags
                  .map((tag) => `<span>${tag}</span>`)
                  .join("")}</div>`
              : "";
            const meta = session.meta
              ? `<p class="program-meta">${session.meta}</p>`
              : "";
            const description = session.description
              ? `<p class="program-description">${session.description}</p>`
              : "";

            return `
              <article class="program-session">
                <div class="program-time">${session.time}</div>
                <div>
                  <h3 class="program-title">${session.title}</h3>
                  ${meta}
                  ${description}
                  ${tags}
                </div>
              </article>
            `;
          })
          .join("");

        return `
          <section class="program-day">
            <div class="program-day-header">
              <h3>${day.title}</h3>
              <p class="program-day-date">${day.date}</p>
            </div>
            <div class="program-session-list">${sessions}</div>
          </section>
        `;
      })
      .join("");
  }

  if (printButton) {
    printButton.addEventListener("click", () => {
      window.print();
    });
  }
})();
