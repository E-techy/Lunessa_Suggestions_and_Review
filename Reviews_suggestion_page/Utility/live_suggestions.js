let liveLastTimestamp = null; // for pagination
let liveFilterType = "latest"; // default filter
const LIVE_PAGE_SIZE = 4;

// Fetch live suggestions from server
async function fetchLiveSuggestions({ reset = false } = {}) {
  try {
    console.log('hshshhs');
    
    console.log("🚀 Fetching live suggestions...", { reset, liveLastTimestamp, liveFilterType });

    const url = new URL("/live_suggestions", window.location.origin);
    url.searchParams.append("filterType", liveFilterType);
    if (liveLastTimestamp && !reset) {
      url.searchParams.append("timestamp", liveLastTimestamp.toISOString());
      console.log("📅 Using timestamp for pagination:", liveLastTimestamp);
    }

    const res = await fetch(url, { method: "POST" });
    const data = await res.json();
    
    console.log("📦 Server response:", data);

    if (data.success) {
      renderLiveSuggestions(data.suggestions, reset);

      // update last timestamp for pagination
      if (data.suggestions.length > 0) {
        const last = data.suggestions[data.suggestions.length - 1];
        liveLastTimestamp = new Date(last.createdAt);
        console.log("⏱ Updated lastTimestamp for pagination:", liveLastTimestamp);
      }
    } else {
      console.warn("⚠️ Failed to fetch:", data.message);
    }
  } catch (err) {
    console.error("❌ Error fetching live suggestions:", err);
  }
}

// Render live suggestions into UI
function renderLiveSuggestions(suggestions, reset = false) {
  console.log("🖌 Rendering live suggestions:", suggestions);

  const container = document.getElementById("liveSuggestionList");
  if (reset) container.innerHTML = ""; // clear old

  suggestions.forEach(s => {
    const formattedCreatedDate = new Date(s.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
    const formattedAcceptedDate = s.acceptedAt
      ? new Date(s.acceptedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric"
        })
      : null;
    const formattedLastDate = new Date(s.lastModified).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });

    const card = document.createElement("div");
    card.className = "live-feature-card";
    card.innerHTML = `
      <div class="live-feature-title">${s.suggestionDescription}</div>
      <div class="live-feature-description">${s.suggestionCategory}</div>
      <span class="live-feature-status live-badge-live">
        <i class="fas fa-broadcast-tower"></i> Live
      </span>
      <div class="live-feature-meta">
        <span class="live-feature-date">Created: ${formattedCreatedDate}</span>
        ${s.accepted && formattedAcceptedDate ? `<span class="live-feature-users">Accepted: ${formattedAcceptedDate}</span>` : ""}
        <span class="live-feature-modified-date">Last Modified: ${formattedLastDate}</span>
      </div>
    `;
    container.appendChild(card);
  });

  // Ensure Load More button exists
  if (!document.querySelector("#loadMoreLive-suggestion") && suggestions.length === LIVE_PAGE_SIZE) {
    console.log("➕ Adding Load More button");
    const loadMoreDiv = document.createElement("div");
    loadMoreDiv.className = "live-load-more-wrapper";
    loadMoreDiv.style.cssText = "text-align: center; margin-top: 16px; padding-top: 16px; border-top:1px solid #e5e7eb;";
    loadMoreDiv.innerHTML = `
      <button class="live-load-more-button" id="loadMoreLive-suggestion">
        <i class="fas fa-chevron-down"></i> Load More
      </button>
    `;
    container.appendChild(loadMoreDiv);

  // ✅ bind after adding
  document.getElementById("loadMoreLive-suggestion").addEventListener("click", loadMoreLiveSuggestions);
}

}

// Filter dropdown handler
function filterLiveSuggestions(value) {
  console.log("🔄 Filter changed:", value);
  liveFilterType = value;
  liveLastTimestamp = null; // reset pagination
  fetchLiveSuggestions({ reset: true });
}

// Load More button handler
function loadMoreLiveSuggestions() {
  console.log("⬇️ Load More clicked");
  fetchLiveSuggestions();
}

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  console.log("📄 DOM ready, initializing live suggestions");

  // attach filter listener
  const filterSelect = document.getElementById("resolved-sort-filter");
  if (filterSelect) {
    filterSelect.addEventListener("change", (e) => filterLiveSuggestions(e.target.value));
  }

  fetchLiveSuggestions({ reset: true });
});
