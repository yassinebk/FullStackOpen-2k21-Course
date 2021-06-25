import React from "react";
import "./Numbers.css";

const Numbers = (props) => {
  const ulStyle = {
    textAlign: "center",
    listStyle: "none",
  };
  const liStyle = {
    marginTop: 10,
    color: "#3c6e71",
  };
  const buttonStyle = {
    marginLeft: 10,
  };

  const displayedList = props.person.filter(
    (element) =>
      element.name.toUpperCase().indexOf(props.searchValue.toUpperCase()) === 0
  );

  return (
    <div>
      <h2>Numbers</h2>
      <ul style={ulStyle}>
        {displayedList.map((person) => {
          return (
            <li style={liStyle} key={person.name}>
              {person.name + "   :::    " + person.number}
              <button
                style={buttonStyle}
                onClick={() => props.delete(person.id, person.name)}
              >
                X
              </button>{" "}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Numbers;
