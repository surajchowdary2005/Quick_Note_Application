const noteInput = document.getElementById("noteInput");
const addNoteButton = document.getElementById("addNoteButton");
const notesContainer = document.getElementById("notesContainer");


// ===============================
// SHOW MESSAGE
// ===============================
function showMessage(message) {
    alert(message);
}


// ===============================
// GET NOTES
// ===============================
async function loadNotes() {

    try {

        const response = await fetch("/notes");

        if (!response.ok) {
            throw new Error("Failed to load notes");
        }

        const notes = await response.json();

        displayNotes(notes);

    } catch (error) {

        console.error("Error loading notes:", error);

        notesContainer.innerHTML =
            "<p class='empty-message'>Unable to load notes.</p>";
    }
}


// ===============================
// DISPLAY NOTES
// ===============================
function displayNotes(notes) {

    notesContainer.innerHTML = "";

    if (notes.length === 0) {

        notesContainer.innerHTML =
            "<p class='empty-message'>No notes yet. Add your first note! 📝</p>";

        return;
    }

    notes.forEach(note => {

        const noteElement = document.createElement("div");

        noteElement.className = "note";

        noteElement.innerHTML = `
            <div class="note-text">
                📝 ${note.text}
            </div>

            <button
                class="delete-button"
                onclick="deleteNote(${note.id})">
                🗑️ Delete
            </button>
        `;

        notesContainer.appendChild(noteElement);
    });
}


// ===============================
// ADD NOTE
// ===============================
async function addNote() {

    const text = noteInput.value.trim();

    if (text === "") {

        showMessage("Please enter a note!");

        noteInput.focus();

        return;
    }

    try {

        const response = await fetch("/notes", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                text: text
            })
        });

        if (!response.ok) {

            const error = await response.json();

            showMessage(error.error);

            return;
        }

        noteInput.value = "";

        await loadNotes();

        showMessage("Note added successfully! ✅");

        noteInput.focus();

    } catch (error) {

        console.error("Error adding note:", error);

        showMessage("Unable to add note.");
    }
}


// ===============================
// DELETE NOTE
// ===============================
async function deleteNote(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this note?"
    );

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(`/notes/${id}`, {

            method: "DELETE"
        });

        if (!response.ok) {

            const error = await response.json();

            showMessage(error.error);

            return;
        }

        await loadNotes();

        showMessage("Note deleted successfully! 🗑️");

    } catch (error) {

        console.error("Error deleting note:", error);

        showMessage("Unable to delete note.");
    }
}


// ===============================
// ADD BUTTON
// ===============================
addNoteButton.addEventListener("click", addNote);


// ===============================
// ENTER KEY
// ===============================
noteInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        addNote();
    }
});


// ===============================
// LOAD NOTES ON PAGE START
// ===============================
loadNotes();