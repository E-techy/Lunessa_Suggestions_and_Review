// =============================
// statusRenderer.js
// =============================
window.statusRenderer = (function () {
  function getStatusInfo(status) {
    switch (status.toLowerCase()) {
      case "pending":
        return { icon: "fas fa-clock", class: "badge-pending"};
      case "under-review":
        return { icon: "fas fa-eye", class: "badge-under-review"};
      case "under review":
        return { icon: "fas fa-eye", class: "badge-under-review"};
      case "in-progress":
        return { icon: "fas fa-cog fa-spin", class: "badge-progress"};
      case "in progress":
        return { icon: "fas fa-cog fa-spin", class: "badge-progress"};
      case "live":
        return { icon: "fas fa-broadcast-tower", class: "badge-live"};
      case "completed":
        return { icon: "fas fa-check-circle", class: "badge-completed"};
      case "resolved":
        return { icon: "fas fa-check", class: "badge-resolved"};
      case "rejected":
        return { icon: "fas fa-times-circle", class: "badge-rejected"};
      default:
        return { icon: "fas fa-question-circle", class: "badge-unknown" };
    }
  }

  return {
    getStatusInfo,
  };
})();


// =============================
// active_issues.js
// =============================
document.addEventListener("DOMContentLoaded", () => {
  const filterSelect = document.getElementById("activeIssuesFilter");
  const tabButtons = document.querySelectorAll(".sidebar-active-issue-btn");
  const tabContents = document.querySelectorAll(".sidebar-active-issue-content");

  const pendingList = document.getElementById("pendingIssuesList");
  const activeList = document.getElementById("activeIssuesList-issue");
  const loadMorePendingBtn = document.getElementById("loadMorePending-issue");
  const loadMoreActiveBtn = document.getElementById("loadMoreActive");

  const PAGE_SIZE = 3;
  let lastTimestamps = { pending: null, active: null };

  console.log("📌 Initializing Active Issues page...");

  // =============================
  // Load More buttons with stable scroll (no jump)
  // =============================
  document.querySelector(".btn-load-more-pending-issue")?.addEventListener("click", async () => {
    await fetchSuggestions("pending", false);
  });

  document.querySelector(".btn-load-more-active-issue")?.addEventListener("click", async () => {
    await fetchSuggestions("active", false);
  });

  // Initial fetch for both tabs
  fetchSuggestions("pending", true);
  fetchSuggestions("active", true);

  // Tab switching
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab; // "pending-active-issue" | "active-active-issue"

      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      tabContents.forEach(c => c.classList.remove("active"));
      if (tab === "pending-active-issue") {
        document.getElementById("active-issues-pending").classList.add("active");
        fetchSuggestions("pending", true);
      } else {
        document.getElementById("active-issues-active").classList.add("active");
        fetchSuggestions("active", true);
      }
    });
  });

  // Filter change → reset & reload both
  filterSelect.addEventListener("change", () => {
    lastTimestamps = { pending: null, active: null };
    fetchSuggestions("pending", true);
    fetchSuggestions("active", true);
  });

  // Load More buttons (use your actual IDs)
  loadMorePendingBtn?.addEventListener("click", () => fetchSuggestions("pending", false));
  loadMoreActiveBtn?.addEventListener("click", () => fetchSuggestions("active", false));

  // Helpers to get UI elements by type
  function getUI(type) {
    return {
      container: type === "pending" ? pendingList : activeList,
      btn: type === "pending" ? loadMorePendingBtn : loadMoreActiveBtn,
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
        btn.style.display = ""; // ensure visible
      }
    }

    const loader = document.createElement("div");
    loader.className = "loading";
    loader.textContent = "Loading...";
    container.appendChild(loader);

    try {
      const url = new URL("/active_suggestions", window.location.origin);
      url.searchParams.set("filterType", filterSelect.value);
      url.searchParams.set("suggestionType", type);
      if (lastTimestamps[type]) url.searchParams.set("timestamp", lastTimestamps[type]);

      const res = await fetch(url.toString(), {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();
      loader.remove();

      if (!data.success) throw new Error(data.message || "Failed to fetch");

      // Nothing returned → stop
      if (!data.suggestions || data.suggestions.length === 0) {
        noMore(type);
        return;
      }

      // Decide what to render: first PAGE_SIZE on reset, otherwise all returned
      let toRender = data.suggestions;
      if (reset) toRender = data.suggestions.slice(0, PAGE_SIZE);

      // Render items
      toRender.forEach(s => {
        const statusInfo = window.statusRenderer.getStatusInfo(s.suggestionStatus);
        const created = new Date(s.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
        const modified = new Date(s.lastModified).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

        const el = document.createElement("div");
        el.className = "status-item";
        el.innerHTML = `
          <div class="status-title">${s.name} - ${s.suggestionCategory}</div>
          <div class="status-desc">${s.suggestionDescription}</div>
          <span class="status-badge ${statusInfo.class}" style="color:${statusInfo.color}">
            <i class="${statusInfo.icon}"></i> ${s.suggestionStatus}
          </span>
          <div class="status-meta">
            <span class="status-date">Created: ${created}</span>
            <span class="last-modified-date">Last Modified: ${modified}</span>
          </div>
          ${
            s.files && s.files.length
              ? `<div class="status-files">
                  ${s.files.map(f => `<a href="${f.url || '#'}" target="_blank">${f.name || 'file'}</a>`).join(", ")}
                 </div>`
              : ""
          }
        `;
        container.appendChild(el);
      });

      // Fix height based on actual number of rendered items (max 3), then enable scroll on later loads
      if (reset) {
        fixHeightFromRendered(container);
        container.style.overflowY = "hidden";
      } else {
        container.style.overflowY = "auto"; // scroll after "load more"
      }

      // Update timestamp using last item we actually rendered
      const last = toRender[toRender.length - 1];
      if (last) lastTimestamps[type] = new Date(last.createdAt).toISOString();

      // If server returned fewer than we asked for on non-reset, consider that "no more"
      if (!reset && data.suggestions.length === 0) noMore(type);
    } catch (err) {
      console.error(`❌ Error fetching ${type} suggestions:`, err);
      loader.remove();
      const { container } = getUI(type);
      if (!container.querySelector(".error")) {
        container.insertAdjacentHTML("beforeend", `<div class="error">⚠️ Failed to load issues. Please try again.</div>`);
      }
    }
  }

  function fixHeightFromRendered(container) {
    const items = container.querySelectorAll(".status-item");
    // Sum the first up-to-3 items only (or fewer if not available)
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
      btn.textContent = "No more issues";
    }
  }
});


