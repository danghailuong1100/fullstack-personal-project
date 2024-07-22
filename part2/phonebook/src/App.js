import { useState, useEffect } from "react";
import phonebookService from "./phonebook";

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className={message.type}>{message.content}</div>;
};

const SearchFilter = ({ searchTerm, onChangeText }) => {
  return (
    <div>
      filter shown with{" "}
      <input
        value={searchTerm}
        onChange={(e) => {
          e.preventDefault();
          onChangeText(e.target.value);
        }}
      />
    </div>
  );
};

const PersonForm = ({
  newName,
  newNumber,
  onChangeName,
  onChangeNumber,
  onSubmit,
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div>
        name:{" "}
        <input
          value={newName}
          onChange={(e) => {
            e.preventDefault();
            onChangeName(e.target.value);
          }}
        />
      </div>
      <div>
        number:{" "}
        <input
          value={newNumber}
          onChange={(e) => {
            e.preventDefault();
            onChangeNumber(e.target.value);
          }}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Person = ({ person, onPressDelete }) => {
  return (
    <p>
      {person.name} {person.number}{" "}
      <button
        onClick={(e) => {
          e.preventDefault();
          onPressDelete(person);
        }}
      >
        delete
      </button>
    </p>
  );
};

const People = ({ persons, onPressDelete }) => {
  return (
    <div>
      {persons.map((person) => {
        return (
          <Person
            key={person.id}
            person={person}
            onPressDelete={onPressDelete}
          />
        );
      })}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  const [message, setMessage] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    phonebookService.getAll().then((res) => {
      setPersons(res.data);
    });
  }, []);

  const onSubmit = () => {
    const newEntry = { name: newName, number: newNumber };
    const maybeFoundPerson = persons.find((person) => person.name === newName);
    if (maybeFoundPerson) {
      const didUserConfirm = window.confirm(
        `${newName} is already added to phonebook, replace old number with a new one?`
      );
      if (didUserConfirm) {
        phonebookService
          .update(maybeFoundPerson.id, newEntry)
          .then(({ data }) => {
            setPersons(
              persons.map((person) => (person.id === data.id ? data : person))
            );
            setMessage({
              content: `${newName}'s number has been updated.`,
              type: "success",
            });
          })
          .catch((error) => {
            setMessage({
              content: error.response.data.error,
              type: "error",
            });
          });
      }
    } else {
      phonebookService
        .create(newEntry)
        .then((res) => {
          const addedNumber = res.data;
          setPersons([...persons, addedNumber]);
          setNewName("");
          setNewNumber("");
          setMessage({
            content: `Added ${newName}.`,
            type: "success",
          });
        })
        .catch((error) => {
          setMessage({
            content: error.response.data.error,
            type: "error",
          });
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <SearchFilter searchTerm={searchTerm} onChangeText={setSearchTerm} />
      <h3>add a new</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        onChangeName={setNewName}
        onChangeNumber={setNewNumber}
        onSubmit={onSubmit}
      />
      <h3>Numbers</h3>
      <People
        persons={persons.filter((person) => {
          return person.name.toLowerCase().includes(searchTerm.toLowerCase());
        })}
        onPressDelete={({ id, name }) => {
          const didUserConfirm = window.confirm(`Delete ${name}?`);
          if (didUserConfirm) {
            phonebookService
              .remove(id)
              .then(() => {
                setPersons(persons.filter((person) => person.id !== id));
                setMessage({
                  content: `Deleted ${name}.`,
                  type: "success",
                });
              })
              .catch((error) => {
                setMessage({
                  content: error.response.data.error,
                  type: "error",
                });
              });
          }
        }}
      />
    </div>
  );
};

export default App;
