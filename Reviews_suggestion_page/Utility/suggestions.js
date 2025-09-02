// ============================
// Suggestions Data Module
// ============================
window.suggestionsData = (function() {
    let allSuggestions = [];
    let filteredSuggestions = [];

    function setAllSuggestions(suggestions) {
        allSuggestions = suggestions;
        filteredSuggestions = [...suggestions];
    }

    function getAllSuggestions() { return allSuggestions; }
    function setFilteredSuggestions(list) { filteredSuggestions = list; }
    function getFilteredSuggestions() { return filteredSuggestions; }

    return {
        setAllSuggestions,
        getAllSuggestions,
        setFilteredSuggestions,
        getFilteredSuggestions
    };
})();

// ============================
// Filter Module
// ============================
window.suggestionsFilter = (function() {
    function applyFilters() {
        if (!window.suggestionsData) return;

        const category = document.getElementById("categoryFilter")?.value || "";
        const status = document.getElementById("statusFilter")?.value || "";
        const descSearch = document.getElementById("descriptionSearch")?.value?.trim().toLowerCase() || "";

        const all = window.suggestionsData.getAllSuggestions();

        const filtered = all.filter(s => {
            const catMatch = !category || s.suggestionCategory.toLowerCase() === category.toLowerCase();
            const statusValues = status.split(",").map(v => v.trim().toLowerCase()).filter(Boolean);
            const statusMatch = !status || statusValues.some(v => s.suggestionStatus.toLowerCase() === v);
            const descMatch = !descSearch || s.suggestionDescription.toLowerCase().includes(descSearch);
            return catMatch && statusMatch && descMatch;
        });

        window.suggestionsData.setFilteredSuggestions(filtered);

        if (window.suggestionsRenderer) window.suggestionsRenderer.renderTable();
    }

    function clearFilters() {
        ["categoryFilter", "statusFilter", "descriptionSearch"].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = "";
        });

        const all = window.suggestionsData.getAllSuggestions();
        window.suggestionsData.setFilteredSuggestions([...all]);

        if (window.suggestionsRenderer) window.suggestionsRenderer.renderTable();
    }

    return { applyFilters, clearFilters };
})();

// ============================
// Renderer Module
// ============================
window.suggestionsRenderer = (function() {
    function getStatusInfo(status) {
        switch (status.toLowerCase()) {
            case "pending": return { icon: "fas fa-clock", class: "status-pending", color: "#ffa500"};
            case "under-review": return { icon: "fas fa-eye", class: "status-under-review", color: "#2196f3"};
            case "in-progress": return { icon: "fas fa-cog fa-spin", class: "status-progress", color: "#ff9800"};
            case "live": return { icon: "fas fa-broadcast-tower", class: "status-live", color: "#4caf50"};
            case "completed": return { icon: "fas fa-check-circle", class: "status-completed", color: "#28a745"};
            case "resolved": return { icon: "fas fa-check", class: "status-resolved"};
            case "rejected": return { icon: "fas fa-times-circle", class: "status-rejected", color: "#dc3545"};
            default: return { icon: "fas fa-question-circle", class: "status-unknown", color: "#6c757d"};
        }
    }

    function renderTable() {
        const tableBody = document.getElementById("suggestionsTableBody");
        if (!tableBody) return;

        const suggestions = window.suggestionsData.getFilteredSuggestions();
        tableBody.innerHTML = "";

        if (!suggestions.length) {
            tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No suggestions found</td></tr>`;
            return;
        }

        suggestions.forEach(s => {
            const statusInfo = getStatusInfo(s.suggestionStatus);
            const formattedDate = new Date(s.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
            });

            const row = document.createElement("tr");
            row.innerHTML = `
                <td><span class="suggestion-category">${s.suggestionCategory}</span></td>
                <td>
                    <div class="suggestion-description" data-full-text="${s.suggestionDescription.replace(/"/g, '&quot;')}">
                        ${s.suggestionDescription.length > 50 
                            ? s.suggestionDescription.substring(0, 50) + "..." 
                            : s.suggestionDescription}
                    </div>
                </td>
                <td>
                    <span class="suggestion-status ${statusInfo.class}">
                        <i class="${statusInfo.icon}"></i> ${s.suggestionStatus || "pending"}
                    </span>
                </td>
                <td><span class="suggestion-date">${formattedDate}</span></td>
                <td>
                    ${s.suggestionStatus === 'pending' ? `
                        <button class="btn btn-small btn-secondary btn-edit" data-id="${s.suggestionId}" title="Edit Suggestion">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-small btn-danger btn-delete" data-id="${s.suggestionId}" title="Delete Suggestion">
                            <i class="fas fa-trash"></i>
                        </button>` : `
                        <span class="no-actions" title="Actions only available for pending suggestions">
                            <i class="fas fa-lock" style="color: #9ca3af; font-size: 14px;"></i>
                        </span>`}
                </td>
            `;
            tableBody.appendChild(row);
        });

        tableBody.querySelectorAll(".btn-edit").forEach(btn => {
            btn.addEventListener("click", () => window.loadSuggestionForEdit(btn.dataset.id, window.suggestionsData.getAllSuggestions()));
        });
        tableBody.querySelectorAll(".btn-delete").forEach(btn => {
            btn.addEventListener("click", () => window.deleteSuggestion(btn.dataset.id));
        });
    }

    return { renderTable };
})();

// ============================
// DOMContentLoaded: Fetch & Form Logic
// ============================
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("suggestionForm");
    const suggestionIdInput = document.getElementById("suggestionId");
    const categoryInput = document.getElementById("suggestionCategory");
    const descriptionInput = document.getElementById("suggestionDescription");
    const filesInput = document.getElementById("suggestionFiles");

    const submitBtn = document.getElementById("submitSuggestionBtn");
    const updateBtn = document.getElementById("updateSuggestionBtn");
    const cancelBtn = document.getElementById("cancelEditSuggestionBtn");

    // Initially hide Update and Cancel buttons
    updateBtn.style.display = "none";
    cancelBtn.style.display = "none";

    async function fetchSuggestions() {
        try {
            const res = await fetch("/get_your_suggestions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}),
                credentials: "include"
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message || "Failed");

            window.suggestionsData.setAllSuggestions(data.suggestions || []);
            window.suggestionsRenderer.renderTable();
        } catch(err) { console.error(err); }
    }

    fetchSuggestions();

    // Create new suggestion
    form?.addEventListener("submit", async e => {
        e.preventDefault();
        if (suggestionIdInput.value.trim()) return; // skip if editing

        const body = {
            suggestionCategory: categoryInput.value,
            suggestionDescription: descriptionInput.value,
            files: Array.from(filesInput.files).map(f => f.name)
        };

        try {
            const res = await fetch(`/suggestion?action=create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
                credentials: "include"
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message || "Failed");

            alert(data.message || "Success");
            form.reset();
            fetchSuggestions();
        } catch(err) { console.error(err); alert("Error: " + err.message); }
    });

    // Update existing suggestion
    updateBtn?.addEventListener("click", async () => {
        const suggestionId = suggestionIdInput.value.trim();
        if (!suggestionId) return;

        const body = {
            suggestionId,
            suggestionCategory: categoryInput.value,
            suggestionDescription: descriptionInput.value,
            files: Array.from(filesInput.files).map(f => f.name)
        };

        try {
            const res = await fetch(`/suggestion?action=modify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
                credentials: "include"
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message || "Failed");

            alert(data.message || "Updated successfully");
            form.reset();
            suggestionIdInput.value = "";

            // Reset buttons
            submitBtn.style.display = "inline-block";
            updateBtn.style.display = "none";
            cancelBtn.style.display = "none";

            fetchSuggestions();
        } catch(err) { console.error(err); alert("Error: " + err.message); }
    });

    // Cancel edit
    cancelBtn?.addEventListener("click", () => {
        form.reset();
        suggestionIdInput.value = "";

        submitBtn.style.display = "inline-block";
        updateBtn.style.display = "none";
        cancelBtn.style.display = "none";
    });

    // Load suggestion for editing
    window.loadSuggestionForEdit = (id, suggestions) => {
        const s = suggestions.find(x => x.suggestionId === id);
        if (!s) return;

        suggestionIdInput.value = s.suggestionId;
        categoryInput.value = s.suggestionCategory;
        descriptionInput.value = s.suggestionDescription;
        filesInput.value = "";

        submitBtn.style.display = "none";
        updateBtn.style.display = "inline-block";
        cancelBtn.style.display = "inline-block";

        // Scroll the form into view with offset (e.g., 100px below title/header)
        const rect = form.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const offset = 100; // adjust this value to fit your header/title height
        window.scrollTo({ top: rect.top + scrollTop - offset, behavior: "smooth" });
    };



    // Delete suggestion
    window.deleteSuggestion = async (id) => {
        if (!confirm("Delete this suggestion?")) return;

        try {
            const res = await fetch("/delete_your_suggestion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ suggestionId: id }),
                credentials: "include"
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message || "Failed");

            alert("Deleted successfully");
            fetchSuggestions();
        } catch(err) { console.error(err); alert("Error: "+err.message); }
    };

    if (window.suggestionsTooltip && typeof window.suggestionsTooltip.initializeTooltipsForSuggestions === "function") {
        window.suggestionsTooltip.initializeTooltipsForSuggestions();
    }
});
