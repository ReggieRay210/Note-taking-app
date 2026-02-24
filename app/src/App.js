import React, { useEffect, useState } from 'react';
import './App.css';
import {PluresNode, SQLiteCompatibleAPI} from "pluresdb";

async function App() {
  // state for the current note being typed in.
  const [currentNote, setCurrentNote] = useState('');
  const [selectedParentId, setSelectedParentId] = useState('');

  // state for storing all notes
  const [notes, setNotes] = useState([]);

  // for note debugging
  // Add this right after your useState declarations
  useEffect(() => {
    console.log('=== LocalStorage Debug ===');
    console.log('1. Checking if localStorage is available:', typeof localStorage !== 'undefined');
    
    try {
      const test = 'test';
      localStorage.setItem('test', test);
      const result = localStorage.getItem('test');
      console.log('2. Can write to localStorage:', result === test);
      localStorage.removeItem('test');
    } catch (e) {
      console.log('3. localStorage error:', e.message);
    }
    
    const savedNotes = localStorage.getItem('notes');
    console.log('4. Existing notes in localStorage:', savedNotes);
    console.log('=========================');
  }, []);

  // Load notes from localStorage when the app starts
  useEffect(() => {
    console.log("Page load/refresh - Attempting to load notes...");
    const savedNotes = localStorage.getItem('notes');
    console.log("Raw data from localStorage on load:", savedNotes);
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        console.log("Parsed Notes on load:", parsedNotes);
        setNotes(JSON.parse(savedNotes));
      }catch (error){
        console.log("Error parsing saved notes:", error);
      }
    }else{
      console.log("No Notes found in localStorage on load");
    }
  }, []);

  // database configuration for pluresDB
  // const db = new PluresNode({
  //   config:{
  //     port:34567,
  //     host:"0.0.0.0", // this will listen on all network interfaces. 
  //     dataDir: "./notes-data",
  //   },
  //   autoStart:true,
  // });

  // // Use SQLite-Compatible API
  // const sqlite = new SQLiteCompatibleAPI();

  // await sqlite.exec(`CREATE TABLE IF NOT EXISTS notes(
  //   id INTEGER PRIMARY KEY,
  //   text TEXT, 
  //   date TEXT,
  //   parentId INTEGER
  // )`);

  // Save notes to localStorage when the notes change
  useEffect(() => {
    console.log("Saving to LocalStorage:",notes);
    localStorage.setItem('notes', JSON.stringify(notes));

    const saved = localStorage.getItem("notes");
    console.log("verified saved notes:", JSON.parse(saved));
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
      {/* Add wave background */}
      <div className='bg'> 
        <svg className='line1' viewBox='0 0 1440 800' preserveAspectRatio='none'>
          <path className='wave w1' d="M0,200 c400,100 800,300 1440,200"/>
          <path className='wave w2' d="M0,250 c400,150 800,350 1440,250"/>
          <path className='wave w3' d="M0,300 c400,200 800,400 1440,300"/>
          <path className='wave w4' d="M0,350 c400,250 800,450 1440,350"/>
        </svg>

        <svg viewBox='0 0 1440 800' preserveAspectRatio='none'>
          <path className='wave w1' d="M0,200 c400,100 800,300 1440,200"/>
          <path className='wave w2' d="M0,250 c400,150 800,350 1440,250"/>
          <path className='wave w3' d="M0,300 c400,200 800,400 1440,300"/>
          <path className='wave w4' d="M0,350 c400,250 800,450 1440,350"/>
        </svg>
      </div>

      <h1>📔 Note-taking App</h1>
      <div className="note-app">
        {/* // Note form will go here */}
        <form onSubmit={handleSubmit} className="note-form">
          <input
            type="text"
            className="note-input"
            placeholder="✏️ Enter your note here..."
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
