
let completedLastTimestamp = null; // for pagination
let completedFilterType = "latest"; // default filter

// Status mapping for completed suggestions
function getCompletedStatusInfo(status) {
  const map = {
    completed: {
      icon: "fas fa-check-circle",
      color: "#2563eb", // blue
      class: "completed-badge-completed",
    },
    live: {
      icon: "fas fa-broadcast-tower",
      color: "#16a34a",
      class: "completed-badge-live",
    },
    pending: {
      icon: "fas fa-clock",
      color: "#f59e0b",
      class: "completed-badge-pending",
    },
  };
  return map[status] || {
    icon: "fas fa-question-circle",
    color: "#6b7280",
    class: "completed-badge-unknown",
  };
}

// Fetch completed suggestions from server
async function fetchCompletedSuggestions({ reset = false } = {}) {
  try {
    console.log("🚀 Fetching completed suggestions...", { reset, completedLastTimestamp, completedFilterType });

    const url = new URL("/completed_suggestions", window.location.origin);
    url.searchParams.append("filterType", completedFilterType);
    if (completedLastTimestamp && !reset) {
      url.searchParams.append("timestamp", completedLastTimestamp.toISOString());
      console.log("📅 Using timestamp for pagination:", completedLastTimestamp);
    }

    const res = await fetch(url, { method: "POST" });
    const data = await res.json();

    console.log("📦 Server response:", data);

    if (data.success) {
      renderCompletedSuggestions(data.suggestions, reset);

      // update last timestamp for pagination
      if (data.suggestions.length > 0) {
        const last = data.suggestions[data.suggestions.length - 1];
        completedLastTimestamp = new Date(last.createdAt);
        console.log("⏱ Updated lastTimestamp for pagination:", completedLastTimestamp);
      }
    } else {
      console.warn("⚠️ Failed to fetch:", data.message);
    }
  } catch (err) {
    console.error("❌ Error fetching completed suggestions:", err);
  }
}

// Render completed suggestions into UI
function renderCompletedSuggestions(suggestions, reset = false) {
  console.log("🖌 Rendering completed suggestions:", suggestions);

  const container = document.getElementById("completedSuggestionList");
  if (reset) container.innerHTML = ""; // clear old

  suggestions.forEach(s => {
    const statusInfo = getCompletedStatusInfo(s.suggestionStatus);
    console.log("💡 Rendering item:", s.suggestionId, statusInfo);
    const formattedcreatedDate = new Date(s.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
    const formattedaccepteddDate = new Date(s.acceptedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    const formattedcompleteddDate = new Date(s.resolutionDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

    const card = document.createElement("div");
    card.className = "completed-feature-card";
    card.innerHTML = `
      <div class="completed-feature-title">${s.name} - ${s.suggestionCategory}</div>
      <div class="completed-feature-description">${s.suggestionDescription}</div>
      <span class="completed-feature-status ${statusInfo.class}" style="color:${statusInfo.color}">
        <i class="${statusInfo.icon}"></i> ${s.suggestionStatus === "completed" ? "Fully Completed" : s.suggestionStatus}
      </span>
      <div class="completed-feature-meta">
        <span class="completed-feature-date">Created: ${formattedcreatedDate}</span>
        ${s.accepted ? `<span class="completed-feature-users">Accepted: ${formattedaccepteddDate}</span>` : ""}
        <span class="completed-feature-users">Completed: ${formattedcompleteddDate}</span>
      </div>
      ${
        s.files && s.files.length > 0
          ? `<div class="completed-feature-files">
              ${s.files
                .map(f => `<a href="${f.url || "#"}" target="_blank">${f.fileName || "file"}.${f.fileExtension}</a>`)
                .join(", ")}
            </div>`
          : ""
      }
    `;
    container.appendChild(card);
  });

  // // Ensure Load More button exists
  // if (!document.querySelector("#loadMoreCompleted-suggestion")) {
  //   console.log("➕ Adding Load More button");
  //   const loadMoreDiv = document.createElement("div");
  //   loadMoreDiv.className = "completed-load-more-wrapper";
  //   loadMoreDiv.style.cssText = "text-align: center; margin-top: 16px; padding-top: 16px; border-top:1px solid #e5e7eb;";
  //   loadMoreDiv.innerHTML = `
  //     <button class="completed-load-more-button" id="loadMoreCompleted-suggestion">
  //       <i class="fas fa-chevron-down"></i> Load More
  //     </button>
  //   `;
  //   container.appendChild(loadMoreDiv);
  // }

}

document.getElementById("loadMoreCompleted-suggestion").addEventListener("click",loadMoreCompletedSuggestions);

// Filter dropdown handler
function filterCompletedSuggestions(value) {
  console.log("🔄 Filter changed:", value);
  completedFilterType = value;
  completedLastTimestamp = null; // reset pagination
  fetchCompletedSuggestions({ reset: true });
}

// Load More button handler
function loadMoreCompletedSuggestions() {
  console.log("⬇️ Load More clicked");
  fetchCompletedSuggestions();
}

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  console.log("📄 DOM ready, initializing completed suggestions");

  // attach filter listener
  const filterSelect = document.getElementById("resolved-sort-filter");
  if (filterSelect) {
    filterSelect.addEventListener("change", (e) => filterCompletedSuggestions(e.target.value));
  }

  fetchCompletedSuggestions({ reset: true });
});

