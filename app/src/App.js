import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  // state for the current note being typed in.
  const [currentNote, setCurrentNote] = useState('');

  // state for storing all notes
  const [notes, setNotes] = useState([]);

  // for note debugging
  // console.log("current notes:", notes )

  // Load notes from localStorage when the app starts
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Save notes to localStorage when the notes chanes
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]); //runs whenever 'notes' state changes.

  // handle submission of form
  const handleSubmit = (form) => {
    form.preventDefault();
    if (currentNote.trim()) {
      const newNote = {
        id: Date.now(), // collect unique ID for timestamp
        text: currentNote,
        date: new Date().toLocaleDateString(),
      };
      setNotes([...notes, newNote]);
      setCurrentNote(''); //clear input after submission
    }
  };

  const handleDelete = (idToDelete) => {
    // remote note with matching id
    const updatedNotes = notes.filter((note) => note.id !== idToDelete);
    setNotes(updatedNotes);
  };

  return (
    <div className="App">
      <h1>📔 Note-taking App</h1>
      <div className="note-app">
        {/* // Note form will go here */}
        <form onSubmit={handleSubmit} className="note-form">
          <input
            type="text"
            className="note-input"
            placeholder="Enter your note here..."
            value={currentNote}
            onChange={(form) => setCurrentNote(form.target.value)}
          />

          <button type="submit" className="add-button">
            Add Note
          </button>
        </form>
        {/* // note list will go here */}
        <div className="notes-list">
          <h2>Your Notes ({notes.length})</h2>

          {/* Display saved notes */}
          {notes.length === 0 ? (
            <p className="no-notes">
              No notes listed yet. Add your first note above!
            </p>
          ) : (
            <div className="notes-grid">
              {notes.map((note) => (
                <div key={note.id} className="note-card">
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(note.id)}
                    aria-label="Delete note"
                  >
                    x
                  </button>
                  <p className="note-text">{note.text}</p>
                  <small className="note-date">{note.date}</small>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default App;
