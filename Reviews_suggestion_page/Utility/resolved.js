// =============================
// resolved.js
// =============================
document.addEventListener("DOMContentLoaded", () => {
  const filterSelect = document.getElementById("resolved-sort-filter");
  const tabButtons = document.querySelectorAll(".resolved-tab-button");
  const tabContents = document.querySelectorAll(".resolved-tab-content");

  const liveList = document.getElementById("liveSuggestionList");
  const completedList = document.getElementById("completedSuggestionList");
  const loadMoreLiveBtn = document.getElementById("loadMoreLive-suggestion");
  const loadMoreCompletedBtn = document.getElementById("loadMoreCompleted-suggestion");

  const PAGE_SIZE = 3;
  let lastTimestamps = { live: null, completed: null };

  console.log("📌 Initializing Resolved Suggestions...");

  // Initial fetch for both tabs
  fetchSuggestions("live", true);
  fetchSuggestions("completed", true);

  // Tab switching
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab; // "resolved-live" | "resolved-completed"

      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      tabContents.forEach(c => c.classList.remove("active"));
      if (tab === "resolved-live") {
        document.getElementById("resolved-live").classList.add("active");
        fetchSuggestions("live", true);
      } else {
        document.getElementById("resolved-completed").classList.add("active");
        fetchSuggestions("completed", true);
      }
    });
  });

  // Filter change → reset & reload both
  filterSelect?.addEventListener("change", () => {
    lastTimestamps = { live: null, completed: null };
    fetchSuggestions("live", true);
    fetchSuggestions("completed", true);
  });

  // Load More buttons
  loadMoreLiveBtn?.addEventListener("click", () => fetchSuggestions("live", false));
  loadMoreCompletedBtn?.addEventListener("click", () => fetchSuggestions("completed", false));

  // Helpers to get UI elements by type
  function getUI(type) {
    return {
      container: type === "live" ? liveList : completedList,
      btn: type === "live" ? loadMoreLiveBtn : loadMoreCompletedBtn,
    };
  }

  // Fetch & render
  async function fetchSuggestions(type, reset = false) {
    const { container, btn } = getUI(type);

    if (reset) {
      container.innerHTML = "";
      lastTimestamps[type] = null;
      container.style.height = "auto";
      container.style.maxHeight = "none";
      container.style.overflowY = "hidden"; // no scroll initially
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Load More";
        btn.style.display = "";
      }
    }

    const loader = document.createElement("div");
    loader.className = "loading";
    loader.textContent = "Loading...";
    container.appendChild(loader);

    try {
      const url = new URL(type === "live" ? "/live_suggestions" : "/completed_suggestions", window.location.origin);
      url.searchParams.set("filterType", filterSelect.value);
      if (lastTimestamps[type]) url.searchParams.set("timestamp", lastTimestamps[type]);

      const res = await fetch(url.toString(), {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();
      loader.remove();

      if (!data.success) throw new Error(data.message || "Failed to fetch");

      if (!data.suggestions || data.suggestions.length === 0) {
        noMore(type);
        return;
      }

      let toRender = data.suggestions;
      if (reset) toRender = data.suggestions.slice(0, PAGE_SIZE);

      toRender.forEach(s => {
        const created = new Date(s.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
        const accepted = s.acceptedAt ? new Date(s.acceptedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : null;
        const modified = s.lastModified ? new Date(s.lastModified).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : null;

        const el = document.createElement("div");
        el.className = type === "live" ? "live-feature-card" : "completed-feature-card";

        if (type === "live") {
          el.innerHTML = `
            <div class="live-feature-title">${s.name} - ${s.suggestionCategory}</div>
            <div class="live-feature-description">${s.suggestionDescription}</div>
            <span class="live-feature-status live-badge-live">
              <i class="fas fa-broadcast-tower"></i> Live
            </span>
            <div class="live-feature-meta">
              <span class="live-feature-date">Created: ${created}</span>
              ${s.accepted && accepted ? `<span class="live-feature-users">Accepted: ${accepted}</span>` : ""}
              ${modified ? `<span class="live-feature-modified-date">Last Modified: ${modified}</span>` : ""}
            </div>
          `;
        } else {
          const statusInfo = getCompletedStatusInfo(s.suggestionStatus);
          const completed = new Date(s.resolutionDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
          el.innerHTML = `
            <div class="completed-feature-title">${s.name} - ${s.suggestionCategory}</div>
            <div class="completed-feature-description">${s.suggestionDescription}</div>
            <span class="completed-feature-status ${statusInfo.class}" style="color:${statusInfo.color}">
              <i class="${statusInfo.icon}"></i> ${s.suggestionStatus === "completed" ? "Fully Completed" : s.suggestionStatus}
            </span>
            <div class="completed-feature-meta">
              <span class="completed-feature-date">Created: ${created}</span>
              ${s.accepted && accepted ? `<span class="completed-feature-users">Accepted: ${accepted}</span>` : ""}
              <span class="completed-feature-users">Completed: ${completed}</span>
            </div>
            ${s.files && s.files.length > 0 ? `<div class="completed-feature-files">
              ${s.files.map(f => `<a href="${f.url || "#"}" target="_blank">${f.fileName || "file"}.${f.fileExtension}</a>`).join(", ")}
            </div>` : ""}
          `;
        }

        container.appendChild(el);
      });

      if (reset) {
        fixHeightFromRendered(container);
        container.style.overflowY = "hidden";
      } else {
        container.style.overflowY = "auto";
      }

      const last = toRender[toRender.length - 1];
      if (last) lastTimestamps[type] = new Date(last.createdAt).toISOString();

      if (!reset && data.suggestions.length === 0) noMore(type);
    } catch (err) {
      console.error(`❌ Error fetching ${type} suggestions:`, err);
      loader.remove();
      if (!container.querySelector(".error")) {
        container.insertAdjacentHTML("beforeend", `<div class="error">⚠️ Failed to load suggestions. Please try again.</div>`);
      }
    }
  }

  function fixHeightFromRendered(container) {
    const items = container.querySelectorAll(".live-feature-card, .completed-feature-card");
    let height = 0;
    for (let i = 0; i < Math.min(items.length, 3); i++) {
      const item = items[i];
      const style = window.getComputedStyle(item);
      const mt = parseFloat(style.marginTop) || 0;
      const mb = parseFloat(style.marginBottom) || 0;
      height += item.offsetHeight + mt + mb;
    }
    requestAnimationFrame(() => {
      container.style.height = `${height}px`;
      container.style.maxHeight = `${height}px`;
    });
  }

  function noMore(type) {
    const { btn, container } = getUI(type);
    if (!container.querySelector(".no-more")) {
      container.insertAdjacentHTML("beforeend", `<div class="no-more"></div>`);
    }
    if (btn) {
      btn.disabled = true;
      btn.textContent = "No more suggestions";
    }
  }

  // Status info for completed
  function getCompletedStatusInfo(status) {
    const map = {
      completed: { icon: "fas fa-check-circle", color: "#2563eb", class: "completed-badge-completed" },
      live: { icon: "fas fa-broadcast-tower", color: "#16a34a", class: "completed-badge-live" },
      pending: { icon: "fas fa-clock", color: "#f59e0b", class: "completed-badge-pending" },
    };
    return map[status] || { icon: "fas fa-question-circle", color: "#6b7280", class: "completed-badge-unknown" };
  }
});
