import React, { useState, useEffect } from "react";
import "./App.css";
import Note from "./Components/Note";
import axios from "axios";
import noteService from "./services/notes";
import Notification from "./Components/Notification"
import Footer from './Components/Footer'

const App = (props) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("a new note ...");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState('some Error has occured');

  useEffect(() => {
    noteService.getAll().then(initialNotes => 
      setNotes(initialNotes)
    );
  }, []);

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
      id: notes.length + 1,
    };

    noteService
    .create(noteObject)
      .then( returnedNote => {
      setNotes(notes.concat(returnedNote));
      setNewNote("");
    });
  };

  const handleChange = (event) => {
    setNewNote(event.target.value);
  };

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);
  console.log('notes to sho')
  const toggleImportanceOf = (id) => {

    const url = `http://localhost:3001/notes/${id}`;
    const note = notes.find((n) => n.id === id);
    const changedNotes = { ...note, important: !note.important };

    noteService
      .update(id, changedNotes)
      .then((returnedNote) => {
      setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)));
      
      }).catch(error => {
        setErrorMessage(`Note ${note.content} was already removed from the server `)
        setTimeout(() => setErrorMessage(null),5000)
        
        setNotes(notes.filter(n => n.id !== id))
      });
  };

  return (
    <div className="App">
    <Notification message={errorMessage} type="error"/>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {
          notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>

      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleChange} />
        <button type="submit">Save </button>
      </form>
    <Footer/>
    </div>
  );
};

export default App;
