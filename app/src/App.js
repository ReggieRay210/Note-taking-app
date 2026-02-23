import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  // state for the current note being typed in.
  const [currentNote, setCurrentNote] = useState('');
  const [selectedParentId, setSelectedParentId] = useState('');

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

  // Save notes to localStorage when the notes change
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
        parentId: selectedParentId || null, 
      };
      setNotes([...notes, newNote]);
      setCurrentNote(''); //clear input after submission
      setSelectedParentId(''); //reset dropdown.
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
            onChange={(ev) => setCurrentNote(ev.target.value)}
          />

          <button type="submit" className="add-button">
            Add Note
          </button>

          {/* dropdown for attaching note to previous created note */}
          <select className='parent-select' value={selectedParentId} onChange={(ev)=>setSelectedParentId(ev.target.value)}>
            <option value=''>-- Attach to existing note(optional) --</option>
            {notes.map((note)=>(
              <option key={note.id} value={note.id}>
              {note.text.substring(0,30)}{note.text.length > 30 ? "...":''}
              </option>
            ))}
          </select>

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
              {notes.map((note) => {
                // find the parent note if it exists
                const parentNote = notes.find(n => n.id === note.parentId);
                return(
                  <div key={note.id} className={`note-card ${note.parentId ? 'has-parent' : '' }`}>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(note.id)}
                      aria-label="Delete note"
                    >
                      x
                    </button>
                    {/* {Show parent badge if note has a parent} */}
                    {parentNote && (
                      <div className="note-parent-badge">
                        ↳ Response to: {parentNote.text.substring(0, 20)}...
                      </div>
                    )}
                    <p className="note-text">{note.text}</p>
                    <small className="note-date">{note.date}</small>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default App;
