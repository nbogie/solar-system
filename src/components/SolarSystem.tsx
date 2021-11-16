import Sketch from "react-p5";
import p5Types from "p5"; //Import this for typechecking and intellisense
import React, { MutableRefObject } from "react";
import PlanetsData from './planetsData.json';
interface Star {
  x: number;
  y: number;
  z: number;
}

interface Sun {
  name: string;
  distance: number;
  radius: number;
  img?: p5Types.Image;
  imagePath: string;
}

interface Planet {
  name: string;
  distance: number;
  radius: number;
  speed: number;
  angle: number;
  img?: p5Types.Image;
  imagePath: string;
  position?: p5Types.Vector;
}
//The interface for the data object that will be passed in from the parent once and used to communicate with the parent
// instead of passing in props.
export interface Controls {
  selectedPlanet: string | null;
  setInteractiveSpeed: (state: boolean) => void;
  setShouldDrawOrbits: (newVal: boolean) => void;
}

interface SolarSystemProps {
  controlsRef: MutableRefObject<Controls | null>;
}

//Avoid stale closure whenn SolarSystemRaw rendered twice - 
//Seems unavoidable, react doesn't guarantee it won't be rendered again, even if props and state don't change!
let isSpeedFlexible = false;
let shouldDrawOrbits = true;

function SolarSystemRaw(props: SolarSystemProps): JSX.Element {

  if (props.controlsRef.current === null) {
    console.log('setting up controls object');
    props.controlsRef.current = {
      selectedPlanet: 'Mars',
      setInteractiveSpeed,
      setShouldDrawOrbits
    };
  }

  let myCamera: p5Types.Camera;
  let cameraTargetPlanet: Planet | null = null;
  let cameraTargetPosition: p5Types.Vector;

  const stars: Star[] = [];
  const sun: Sun = {
    name: "Sun",
    distance: 0,
    radius: 100,
    img: undefined,
    imagePath: "https://i.postimg.cc/0NbzSXtw/sunmap.jpg"
  };
  const planets: Planet[] = PlanetsData as Planet[];

  const moon: Planet = {
    name: "Moon",
    distance: 20,
    radius: 3,
    speed: 0.05,
    angle: 0,
    imagePath: "https://i.postimg.cc/cCXDP9JB/moonmap4k.jpg",
    img: undefined,
  };

  const preload = (p5: p5Types) => {
    sun.img = p5.loadImage(sun.imagePath);
    for (const planet of planets) {
      planet.img = p5.loadImage(planet.imagePath);
    }
    moon.img = p5.loadImage(moon.imagePath);
  };

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(p5.windowWidth - 25, p5.windowHeight - 130, p5.WEBGL).parent(canvasParentRef);
    createStars(p5);
    setupCamera(p5);
  };

  const draw = (p5: p5Types) => {
    p5.background(0);
    p5.orbitControl(4, 4);
    p5.directionalLight(p5.color(150, 100, 0, 0.05), p5.createVector(0, -1, 0));
    p5.pointLight(p5.color(150, 100, 0), 0, 0, 0);
    p5.ambientLight(180, 150, 150);

    p5.noStroke();

    // movementMultiplier will be -3 when the mouse is at x=0.  
    // and 3 when the mouse is at x=canvas width.
    const movementMultiplier = isSpeedFlexible
      ? p5.map(p5.mouseX, 0, p5.width, -3, 3)
      : 1;

    updatePlanets(p5, movementMultiplier);
    updateCameraTracking(p5);

    drawStars(p5);
    drawSun(p5);
    if (shouldDrawOrbits) {
      drawOrbits(p5);
    }
    drawPlanets(p5);
  };


  const setupCamera = (p5: p5Types) => {
    myCamera = p5.createCamera();
    myCamera.setPosition(0, -400, 1500);
    cameraTargetPosition = p5.createVector(0, 0, 0);
    myCamera.lookAt(cameraTargetPosition.x, cameraTargetPosition.y, cameraTargetPosition.z);
  };

  function setInteractiveSpeed(newVal: boolean) {
    isSpeedFlexible = newVal;
  }
  function setShouldDrawOrbits(newVal: boolean) {
    shouldDrawOrbits = newVal;
  }

  function findPlanetByName(name: string): Planet | null {
    const result = planets.find(p => p.name === name);
    return result ? result : null;
  }
  const drawSun = (p5: p5Types) => {
    p5.push();
    if (sun.img !== undefined) {
      p5.texture(sun.img);
    } else {
      p5.ambientMaterial(p5.color("#ed6663"));
    }
    p5.rotateY(p5.frameCount / 100);
    p5.sphere(sun.radius);
    p5.pop();
  };

  const drawPlanets = (p5: p5Types) => {
    for (const planet of planets) {
      p5.push();
      drawPlanet(p5, planet);
      p5.pop();
    }
  };
  /**
   * Move the planets along their orbit according to their individual speeds and the movementMultiplier
   * @param movementMultiplier - A number to use to multiply the speed at which the planets orbit.  
   * If zero, the planets will not move.  Can be negative, for backwards motion.
   */
  const updatePlanets = (p5: p5Types, movementMultiplier: number) => {
    for (const planet of planets) {
      updatePlanet(p5, planet, movementMultiplier);
    }
  };

  //Mutates given planet object, adjusting its angle based on its speed.
  function updatePlanet(p5: p5Types, planet: Planet, movementMultiplier: number) {
    const x = planet.distance * p5.cos(planet.angle);
    const y = planet.distance * p5.sin(planet.angle);
    planet.position = p5.createVector(x, 0, y);
    planet.angle += planet.speed * movementMultiplier
  }

  function drawPlanet(
    p5: p5Types,
    planet: Planet,
  ) {
    if (planet.position) {
      p5.translate(planet.position);
    }
    if (planet.img !== undefined) {
      p5.texture(planet.img);
    } else {
      p5.ambientMaterial(p5.color("#e93dc8"));
    }
    p5.rotateY(p5.frameCount / 100);
    p5.sphere(planet.radius);

    if (planet.name === "Saturn") {
      drawRings(p5, 100);
    } else if (planet.name === "Earth") {
      drawMoon(p5);
    }
  }

  const drawMoon = (p5: p5Types) => {
    p5.rotateX(-p5.PI / 4);
    const x = moon.distance * p5.cos(moon.angle);
    const y = moon.distance * p5.sin(moon.angle);

    p5.translate(x, 0, y);
    moon.angle += moon.speed;
    if (moon.img !== undefined) {
      p5.texture(moon.img);
    }
    p5.rotateY(p5.frameCount / 100);
    p5.sphere(moon.radius);
  };

  const drawRings = (p5: p5Types, distanceFromPlanet: number) => {
    p5.rotateX(p5.PI / 4);
    p5.strokeWeight(10);
    p5.stroke(170);
    p5.noFill();
    p5.ellipse(0, 0, distanceFromPlanet * 2, distanceFromPlanet * 2, 50);
  };

  const drawOrbits = (p5: p5Types) => {
    for (const planet of planets) {
      p5.push();
      drawOrbit(p5, planet.distance);
      p5.pop();
    }
  };

  function drawOrbit(p5: p5Types, distance: number) {
    // draw orbit
    p5.rotateX(p5.PI / 2);
    p5.strokeWeight(0.5);
    p5.stroke(150);
    p5.noFill();
    p5.ellipse(0, 0, distance * 2, distance * 2, 50);
  }

  const createStars = (p5: p5Types) => {
    for (let i = 0; i < 1300; i++) {
      const star = p5Types.Vector.random3D().mult(p5.random(1600, 5000));
      stars.push(star);
    }
  };
  const drawStars = (p5: p5Types) => {
    for (const star of stars) {
      p5.push();
      drawStar(p5, star);
      p5.pop();
    }
  };
  function drawStar(p5: p5Types, star: Star) {
    p5.translate(star.x, star.y, star.z);
    p5.ambientMaterial(p5.color("#fff"));
    p5.sphere(3);
  }

  function updateCameraTracking(p5: p5Types) {
    const currentControls: Controls | null = props.controlsRef.current;
    // console.log({ currentControls })
    // if props has a selected planet but we're not yet tracking it, do so
    if (currentControls && currentControls.selectedPlanet && (!cameraTargetPlanet || cameraTargetPlanet.name !== currentControls.selectedPlanet)) {
      cameraTargetPlanet = findPlanetByName(currentControls.selectedPlanet);
    } else {
      cameraTargetPlanet = null;
    }
    // If we have a target, move ('lerp') our look target a little towards it, rather than simply setting it.
    // We do this with for smooth transitions when the target changes.
    if (cameraTargetPlanet && cameraTargetPlanet.position && myCamera) {
      cameraTargetPosition.lerp(cameraTargetPlanet?.position, 0.05);
    }

    myCamera.lookAt(
      cameraTargetPosition.x,
      cameraTargetPosition.y,
      cameraTargetPosition.z
    );

  }


  function keyPressed(p5: p5Types) {
    //placeholder
  }

  function windowResized(p5: p5Types) {
    //slower than it should be, currently...
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  }

  return <Sketch
    setup={setup}
    draw={draw}
    preload={preload}
    keyPressed={keyPressed}
    windowResized={windowResized}
  />;
}

//Won't re-render just because parent does.  
//Only if props change (or context)
//Sadly, this does not seem guaranteed, so we MIGHT get rendered again.
// (Strict mode's first double-render does happen, for example)
//https://reactjs.org/docs/react-api.html#reactmemo
const SolarSystemMemoized = React.memo(SolarSystemRaw);
export default SolarSystemMemoized;

