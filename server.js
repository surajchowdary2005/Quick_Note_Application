const express = require("express");
const fs = require("fs");

const app = express();

const PORT = process.env.PORT || 3000;
const NOTES_FILE = "notes.json";

// Allow JSON data from frontend
app.use(express.json());

// Serve frontend files from public folder
app.use(express.static("public"));


// ===============================
// GET ALL NOTES
// ===============================
app.get("/notes", (req, res) => {

    fs.readFile(NOTES_FILE, "utf8", (err, data) => {

        if (err) {
            return res.status(500).json({
                error: "Unable to read notes"
            });
        }

        const notes = JSON.parse(data);

        res.json(notes);
    });
});


// ===============================
// CREATE NEW NOTE
// ===============================
app.post("/notes", (req, res) => {

    const { text } = req.body;

    if (!text || text.trim() === "") {
        return res.status(400).json({
            error: "Note text is required"
        });
    }

    fs.readFile(NOTES_FILE, "utf8", (err, data) => {

        if (err) {
            return res.status(500).json({
                error: "Unable to read notes"
            });
        }

        const notes = JSON.parse(data);

        const newNote = {
            id: Date.now(),
            text: text.trim()
        };

        notes.push(newNote);

        fs.writeFile(
            NOTES_FILE,
            JSON.stringify(notes, null, 2),
            (err) => {

                if (err) {
                    return res.status(500).json({
                        error: "Unable to save note"
                    });
                }

                res.status(201).json(newNote);
            }
        );
    });
});


// ===============================
// DELETE NOTE
// ===============================
app.delete("/notes/:id", (req, res) => {

    const noteId = Number(req.params.id);

    fs.readFile(NOTES_FILE, "utf8", (err, data) => {

        if (err) {
            return res.status(500).json({
                error: "Unable to read notes"
            });
        }

        let notes = JSON.parse(data);

        const noteExists = notes.some(note => note.id === noteId);

        if (!noteExists) {
            return res.status(404).json({
                error: "Note not found"
            });
        }

        notes = notes.filter(note => note.id !== noteId);

        fs.writeFile(
            NOTES_FILE,
            JSON.stringify(notes, null, 2),
            (err) => {

                if (err) {
                    return res.status(500).json({
                        error: "Unable to delete note"
                    });
                }

                res.json({
                    message: "Note deleted successfully"
                });
            }
        );
    });
});


// ===============================
// START SERVER
// ===============================
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});