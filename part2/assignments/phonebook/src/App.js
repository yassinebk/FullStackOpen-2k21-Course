import "./App.css";
import React, { useState, useEffect } from "react";
import Numbers from "./components/Numbers";
import Form from "./components/Form";
import personService from "./services/requests";
import Notif from "./components/Notification";

function App() {
  const [person, setPerson] = useState([]);
  const [newName, setNewName] = useState("");
  const [{ notificationMessage, notificationType }, setNotification] = useState(
    { notificationMessage: "", notificationType: "none" }
  );

  useEffect(() => {
    personService.getPersonsList().then((personList) => {
      //console.log("getting Persons List", personList);
      setPerson(personList);
    });
  }, []);

  const [newNumber, setNewNumber] = useState("");
  const [searchValue, setSearch] = useState("");
  const handleChangeName = (event) => {
    setNewName(event.target.value);
  };

  const handleChangeNumber = (event) => {
    setNewNumber(event.target.value);
  };

  const newPersonSubmit = (event) => {
    event.preventDefault();
    let exists = 0;
    let id = -1;
    for (let i = 0; i < person.length; i++) {
      if (newName.toUpperCase() === person[i].name.toUpperCase()) {
        exists = 1;
        id = person[i].id;
      }
    }

    if (
      exists &&
      window.confirm(`do you want to update the number for ${newName}`)
    ) {
      personService
        .editPerson(id, { name: newName, number: newNumber })
        .then((editedPerson) => {
          console.log("editedPerson", editedPerson);
          setPerson(
            person.map((element) =>
              element.id === id ? editedPerson : element
            )
          );
          setNotification({
            notificationMessage: `${editedPerson.name} was updated successfully`,
            notificationType: "success",
          });
          setTimeout(() => {
            setNotification({
              notificationMessage: "",
              notificationType: "none",
            });
          }, 6000);

          setNewName("");
          setNewNumber("");
        });
    } else {
      const newPerson = { name: newName, number: newNumber };

      personService
        .addPerson(newPerson)
        .then((newPerson) => {
          //console.log("new Person added", newPerson);
          setPerson(person.concat(newPerson));
          setNotification({
            notificationMessage: `${newPerson.name} was added successfully`,
            notificationType: "success",
          });
          setTimeout(() => {
            setNotification({
              notificationMessage: "",
              notificationType: "none",
            });
          }, 6000);

          setNewName("");
          setNewNumber("");
        })
        .catch((error) => {
          console.log(error.response.data);
          setNotification({
            notificationMessage: `${error.response.data.error} `,
            notificationType: "error",
          });
          setTimeout(
            () =>
              setNotification({
                notificationMessage: "",
                notificationType: "none",
              }),
            6000
          );
        });
    }
  };

  const searchFor = (event) => {
    setSearch(event.target.value);
  };

  const deletePerson = (id, name) => {
    window.confirm(`Do you want to delete  ${name} ?`) &&
      personService
        .deletePerson(id)
        .then((data) => {
          setPerson(person.filter((element) => element.id !== id));
        })
        .catch(() => {
          setNotification({
            notificationMessage: `${name} was already deleted from our server `,
            notificationType: "error",
          });
          setTimeout(
            () =>
              setNotification({
                notificationMessage: "",
                notificationType: "none",
              }),
            6000
          );
        });
  };

  return (
    <div className="App">
      <h2>Phonebook</h2>

      <Notif message={notificationMessage} type={notificationType} />
      <div className="searchBar">
        <label for="search">Search</label>{" "}
        <input
          id="search"
          type="input/text"
          value={searchValue}
          onChange={searchFor}
        />
      </div>
      <Form
        handleChangeName={handleChangeName}
        handleChangeNumber={handleChangeNumber}
        newName={newName}
        newNumber={newNumber}
        newPersonSubmit={newPersonSubmit}
      />
      <Numbers
        delete={deletePerson}
        person={person}
        searchValue={searchValue}
      />
    </div>
  );
}

export default App;
