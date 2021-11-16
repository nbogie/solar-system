import { useEffect, useRef, useState } from "react";
import AppHeader from "./components/AppHeader";
import NavBar from "./components/NavBar";
import SolarSystem, { Controls } from "./components/SolarSystem";
import './App.css';
function App(): JSX.Element {

  //a place we can store state WITHOUT causing a re-render of this containing component,
  //and a resulting re-render of the child component
  //We'll pass this ref once to the SolarSystem component and never change it
  //but we will change what it *contains*, which won't cause a re-render.
  //thus we'll be able to pass data to the child sketch without causing a re-render of the child.
  const controlsRef = useRef<Controls | null>(null);
  const [shouldDrawOrbits, setDrawOrbits] = useState(true);
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [interactiveSpeed, setInteractiveSpeed] = useState(false);

  function handlePlanetNameClick(name: string | null) {
    setSelectedPlanet(name);
  }

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.selectedPlanet = selectedPlanet;
    }
  }, [selectedPlanet]);

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.setInteractiveSpeed(interactiveSpeed);
      controlsRef.current.setShouldDrawOrbits(shouldDrawOrbits);
    }
  }, [interactiveSpeed, shouldDrawOrbits]);





  return (
    <>
      <AppHeader />
      <NavBar
        handlePlanetNameClick={handlePlanetNameClick}
        selectedPlanet={selectedPlanet} />
      <button onClick={() => handlePlanetNameClick(null)}>stop camera-follow</button>
      <button onClick={() => { setInteractiveSpeed(p => !p) }}>{interactiveSpeed ? 'speed: interactive' : 'speed: fixed'}</button>
      <button onClick={() => { setDrawOrbits(p => !p) }}>{shouldDrawOrbits ? 'orbits shown' : 'orbits hidden'}</button>
      <SolarSystem controlsRef={controlsRef} />
    </>
  );
}

export default App;
