(function () {
  if (!window.programData) {
    return;
  }

  const summary = document.getElementById("program-summary");
  const daysContainer = document.getElementById("program-days");
  const printButton = document.getElementById("print-program");
  const { overview, days } = window.programData;

  if (summary) {
    summary.innerHTML = `
      <p class="card-kicker">Program Overview</p>
      <h2>${overview.title}</h2>
      <p class="program-meta">${overview.dateRange} • ${overview.location}</p>
      <p class="program-note">${overview.note}</p>
    `;
  }

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

            return `
              <article class="program-session">
                <div class="program-time">${session.time}</div>
                <div>
                  <h3 class="program-title">${session.title}</h3>
                  <p class="program-meta">${session.meta}</p>
                  <p class="program-description">${session.description}</p>
                  ${tags}
                </div>
              </article>
            `;
          })
          .join("");

        return `
          <section class="program-day">
            <div class="program-day-header">
              <h2>${day.title}</h2>
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
