import { useRef } from "react";
import "./App.css";
import AppHeader from "./components/AppHeader";
import NavBar from "./components/NavBar";
import SolarSystem from "./components/SolarSystem";
import './App.css';
function App(): JSX.Element {

  //a place we can store state WITHOUT causing a re-render (and a re-render of the child component)
  const selectedPlanetRef = useRef<string | null>(null);

  function handlePlanetNameClick(name: string) {
    selectedPlanetRef.current = name;
  }

  return (
    <>
      <AppHeader />
      <NavBar handlePlanetNameClick={handlePlanetNameClick} />
      <SolarSystem selectedPlanetRef={selectedPlanetRef} />
    </>
  );
}

export default App;
