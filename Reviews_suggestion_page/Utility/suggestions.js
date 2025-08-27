// suggestions.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("suggestionForm");
  const suggestionIdInput = document.getElementById("suggestionId");
  const categoryInput = document.getElementById("suggestionCategory");
  const descriptionInput = document.getElementById("suggestionDescription");
  const filesInput = document.getElementById("suggestionFiles");
  const tableBody = document.getElementById("suggestionsTableBody");

  // Fetch suggestions on load
  fetchSuggestions();

  // Handle form submit (create or modify)
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const suggestionId = suggestionIdInput.value.trim();
    const suggestionCategory = categoryInput.value;
    const suggestionDescription = descriptionInput.value;
    const files = Array.from(filesInput.files).map(f => f.name); // keep only names for now

    const action = suggestionId ? "modify" : "create";
    const body = suggestionId
      ? { suggestionId, suggestionCategory, suggestionDescription, files }
      : { suggestionCategory, suggestionDescription, files };

    try {
      const res = await fetch(`/suggestion?action=${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include"
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed");

      alert(data.message || "Success");
      form.reset();
      suggestionIdInput.value = "";
      fetchSuggestions();
    } catch (err) {
      console.error("❌ Error submitting suggestion:", err);
      alert("Error: " + err.message);
    }
  });

  // Fetch and render suggestions
  async function fetchSuggestions() {
    try {
      const res = await fetch("/get_your_suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}), // body required, but auth is from cookies
        credentials: "include"
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to fetch suggestions");

      renderSuggestions(data.suggestions || []);
    } catch (err) {
      console.error("❌ Error fetching suggestions:", err);
    }
  }

  // Render suggestions table
  function renderSuggestions(suggestions) {
    tableBody.innerHTML = "";
    if (!suggestions.length) {
      tableBody.innerHTML = `<tr><td colspan="5">No suggestions found</td></tr>`;
      return;
    }

    suggestions.forEach(s => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${s.suggestionCategory}</td>
        <td>${s.suggestionDescription.substring(0, 50)}...</td>
        <td>${s.suggestionStatus || "pending"}</td>
        <td>${new Date(s.createdAt).toLocaleDateString()}</td>
        <td>
          <button class="btn-edit" data-id="${s.suggestionId}">Edit</button>
          <button class="btn-delete" data-id="${s.suggestionId}">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    // Attach edit/delete events
    tableBody.querySelectorAll(".btn-edit").forEach(btn => {
      btn.addEventListener("click", () => loadSuggestionForEdit(btn.dataset.id, suggestions));
    });
    tableBody.querySelectorAll(".btn-delete").forEach(btn => {
      btn.addEventListener("click", () => deleteSuggestion(btn.dataset.id));
    });
  }

  // Load suggestion back into form for editing
  function loadSuggestionForEdit(id, suggestions) {
    const suggestion = suggestions.find(s => s.suggestionId === id);
    if (!suggestion) return;

    suggestionIdInput.value = suggestion.suggestionId;
    categoryInput.value = suggestion.suggestionCategory;
    descriptionInput.value = suggestion.suggestionDescription;
    filesInput.value = ""; // file re-upload needed
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Delete suggestion
  async function deleteSuggestion(id) {
    if (!confirm("Are you sure you want to delete this suggestion?")) return;

    try {
      const res = await fetch("/delete_your_suggestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suggestionId: id }),
        credentials: "include"
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to delete");
      alert("Deleted successfully");
      fetchSuggestions();
    } catch (err) {
      console.error("❌ Error deleting suggestion:", err);
      alert("Error: " + err.message);
    }
  }
});
