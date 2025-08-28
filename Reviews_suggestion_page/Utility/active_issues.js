// active_issues.js
document.addEventListener("DOMContentLoaded", () => {
  const filterSelect = document.getElementById("activeIssuesFilter");
  const tabButtons = document.querySelectorAll(".sidebar-tab-btn");
  const tabContents = document.querySelectorAll(".sidebar-tab-content");

  const pendingList = document.getElementById("pendingIssuesList");
  const activeList = document.getElementById("activeIssuesList");
  const loadMorePending = document.getElementById("loadMorePending");
  const loadMoreActive = document.getElementById("loadMoreActive");

  // Track last timestamps for pagination
  let lastTimestamps = {
    pending: null,
    active: null,
  };

  console.log("📌 Initializing Active Issues page...");

  // Initialize
  fetchSuggestions("pending");
  fetchSuggestions("active");

  // Tab switching
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      console.log(`📌 Switching tab -> ${tab}`);

      // Toggle active button
      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Toggle content
      tabContents.forEach(c => c.classList.remove("active"));
      document.getElementById(`active-issues-${tab}`).classList.add("active");
    });
  });

  // Filter change reloads both tabs
  filterSelect.addEventListener("change", () => {
    console.log(`🔄 Filter changed to -> ${filterSelect.value}`);
    lastTimestamps = { pending: null, active: null };
    pendingList.innerHTML = "";
    activeList.innerHTML = "";
    fetchSuggestions("pending");
    fetchSuggestions("active");
  });

  // Load more buttons
  loadMorePending.addEventListener("click", () => {
    console.log("⏭ Loading more pending suggestions...");
    fetchSuggestions("pending");
  });

  loadMoreActive.addEventListener("click", () => {
    console.log("⏭ Loading more active suggestions...");
    fetchSuggestions("active");
  });

  // Fetch suggestions from server
  async function fetchSuggestions(type) {
    const filterType = filterSelect.value;
    const timestamp = lastTimestamps[type];

    try {
      console.log(`📡 Fetching ${type} suggestions...`);
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

      console.log(`✅ Received ${data.suggestions.length} ${type} suggestions`);

      renderSuggestions(type, data.suggestions);

      // Update last timestamp for pagination
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
        console.log(`⚠️ No ${type} suggestions found`);
      }
      return;
    }

    suggestions.forEach(s => {
      const item = document.createElement("div");
      item.className = "status-item";
      item.innerHTML = `
        <div class="status-title">${s.name} - ${s.suggestionCategory}</div>
        <div class="status-desc">${s.suggestionDescription}</div>
        <span class="status-badge">${s.suggestionStatus}</span>
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

    console.log(`🎨 Rendered ${suggestions.length} ${type} suggestions`);
  }
});
