import "./App.css";
import React from "react";
import { useState } from "react";


const History = (props) => {
  if (props.allClicks.length === 0) {
    return (
      <div>
        the app is used by pressing the buttons
      </div>
    )
  }
  return (
    <div>
      button press history : {props.allClicks.join(' ')}
    </div>
  )
}
const Display = ({ counter }) => {
  return <p> { counter}</p>;
};

const Button = ({handleClick,text}) => {
  return <button onClick={handleClick}>{text}</button>;
};

/*const Hello = (props) => {
  return <p> Hello World {props.name}</p>;
};*/
const App = () => {

  const [left, setLeft] = useState(0); 
  const [right, setRight] = useState(0); 
  const [allClicks, setAll] = useState([]); 
  
  const handleLeftClick = () =>
  {
    setAll(allClicks.concat('L'));
    setLeft(left + 1);
    }

const handleRightClick = () =>
  {
    setAll(allClicks.concat('R'));
    setRight(right+ 1);
    }
  
  /*setTimeout(
    () => setCounter(counter + 1),1000 
  )*/


 // const increaseByOne = () => setCounter(counter + 1);
 // const reset = () => setCounter(0);
 // const decreaseByOne = () => setCounter(counter - 1); 

  return (
    <div>
      <h1>Greetings</h1>
      <Display counter={right}  text="right"/>
      <Button handleClick={handleRightClick} text="Right" />
      <Display counter={left} text="left" /> 
      <Button handleClick={handleLeftClick} text="Left"/>
      <History allClicks={allClicks}/>
    </div>
  );
};

export default App;
