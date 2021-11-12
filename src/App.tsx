import { useRef, useState } from "react";
import AppHeader from "./components/AppHeader";
import NavBar from "./components/NavBar";
import SolarSystem from "./components/SolarSystem";
import './App.css';
function App(): JSX.Element {

  //a place we can store state WITHOUT causing a re-render of this containing component,
  //and a resulting re-render of the child component
  //We'll pass this ref once to the SolarSystem component and never change it
  //but we will change what it *contains*, which won't cause a re-render.
  //thus we'll be able to pass data to the child sketch without causing a re-render of the child.
  const selectedPlanetRef = useRef<string | null>(null);
  const [counter, setCounter] = useState(0);

  function handlePlanetNameClick(name: string | null) {
    selectedPlanetRef.current = name;
  }

  return (
    <>
      <AppHeader />
      <NavBar handlePlanetNameClick={handlePlanetNameClick} />
      <button onClick={() => handlePlanetNameClick(null)}>stop camera-follow</button>
      <button onClick={() => { setCounter(p => p + 1) }}>+1</button>
      {/* demonstrating the parent app CAN get re-rendered without the child also getting re-rendered. */}
      {counter}
      <SolarSystem selectedPlanetRef={selectedPlanetRef} />
    </>
  );
}

export default App;
