import './App.css';
import React, { useState }from 'react';
import Numbers from "./components/Numbers"
import Form from "./components/Form"



function App() {
  const [person, setPerson] = useState([
     { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' },
  ])
  const [displayedList,setDisplayed] = useState(person)
  const [newName, setNewName] = useState('');

  const [newNumber, setNewNumber] = useState('');
  const [searchValue, setSearch] = useState(''); 
  const handleChangeName = (event) => {
    setNewName(event.target.value);
  }

   
const handleChangeNumber = (event) => {
    setNewNumber(event.target.value);
  }

  const newPersonSubmit = (event) => {
    event.preventDefault()
    let exists = 0;
    for (let i = 0; i < person.length; i++) { if (newName === person[i].name) exists = 1; }
    if (exists) alert(`${newName} is already added to the phonebook`)
    else setPerson(person.concat({ name: newName,number:newNumber }));
    setNewName('');
    setNewNumber('');
  }
  
  const searchFor = (event) => {
   
    setSearch(event.target.value);
    const newDisplay = person.filter((element) => element.name.toUpperCase().indexOf(searchValue.toUpperCase()) === 0);
    setSearch(event.target.value);
    console.log(newDisplay);
    setDisplayed(newDisplay);

  }

  return (
    <div className="App">
    <h2>Phonebook</h2>
    
    <div className="searchBar">
          <label for="search">Search</label> <input id="search" type="input/text" value={searchValue} onChange={searchFor}/>
</div>
      <Form handleChangeName={handleChangeName} handleChangeNumber={handleChangeNumber} newName={newName} newNumber={newNumber} newPersonSubmit={newPersonSubmit}/>
         <Numbers person={displayedList}/>
        </div>
  );
}


export default App;
