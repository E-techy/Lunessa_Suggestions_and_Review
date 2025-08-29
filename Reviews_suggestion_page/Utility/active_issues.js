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
  const loadMorePending = document.getElementById("loadMorePending-issue");
  const loadMoreActive = document.getElementById("loadMoreActive");

  let lastTimestamps = { pending: null, active: null };

  console.log("📌 Initializing Active Issues page...");

  fetchSuggestions("pending");
  fetchSuggestions("active");

  // Tab switching
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      tabContents.forEach(c => c.classList.remove("active"));
      if (tab === "pending-active-issue") {
        document.getElementById("active-issues-pending").classList.add("active");
      } else if (tab === "active-active-issue") {
        document.getElementById("active-issues-active").classList.add("active");
      }
    });
  });

  // Filter change reloads both tabs
  filterSelect.addEventListener("change", () => {
    lastTimestamps = { pending: null, active: null };
    pendingList.innerHTML = "";
    activeList.innerHTML = "";
    fetchSuggestions("pending");
    fetchSuggestions("active");
  });

  // Load more buttons
  loadMorePending.addEventListener("click", () => fetchSuggestions("pending"));
  loadMoreActive.addEventListener("click", () => fetchSuggestions("active"));

  // Fetch suggestions from server
  async function fetchSuggestions(type) {
    const filterType = filterSelect.value;
    const timestamp = lastTimestamps[type];

    try {
      const url = new URL("/active_suggestions", window.location.origin);
      url.searchParams.set("filterType", filterType);
      url.searchParams.set("suggestionType", type);
      if (timestamp) url.searchParams.set("timestamp", timestamp);

      const res = await fetch(url.toString(), {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to fetch");

      renderSuggestions(type, data.suggestions);

      if (data.suggestions.length > 0) {
        const last = data.suggestions[data.suggestions.length - 1];
        lastTimestamps[type] = last.createdAt;
      }
    } catch (err) {
      console.error(`❌ Error fetching ${type} suggestions:`, err);
    }
  }

  // Render suggestion list
  function renderSuggestions(type, suggestions) {
    const container = type === "pending" ? pendingList : activeList;

    if (!suggestions || suggestions.length === 0) {
      if (container.innerHTML === "") {
        container.innerHTML = `<p class="no-data">No ${type} suggestions found.</p>`;
      }
      return;
    }

    suggestions.forEach(s => {
      const statusInfo = window.statusRenderer.getStatusInfo(s.suggestionStatus);

      const item = document.createElement("div");
      item.className = "status-item";
      item.innerHTML = `
        <div class="status-title">${s.name} - ${s.suggestionCategory}</div>
        <div class="status-desc">${s.suggestionDescription}</div>
        <span class="status-badge ${statusInfo.class}" style="color:${statusInfo.color}">
          <i class="${statusInfo.icon}"></i> ${s.suggestionStatus}
        </span>
        <div class="status-meta">
          <span class="status-date">Created: ${new Date(s.createdAt).toLocaleDateString()}</span>
          <span class="status-date">Last Modified: ${new Date(s.lastModified).toLocaleDateString()}</span>
        </div>
        ${s.files && s.files.length > 0 ? `
          <div class="status-files">
            ${s.files.map(f => `<a href="${f.url || '#'}" target="_blank">${f.name || 'file'}</a>`).join(", ")}
          </div>` : ""}
      `;
      container.appendChild(item);
    });
  }
});
