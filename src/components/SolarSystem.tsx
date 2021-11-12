import Sketch from "react-p5";
import p5Types from "p5"; //Import this for typechecking and intellisense
import { MutableRefObject } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
}

interface Sun {
  name: string;
  distance: number;
  radius: number;
  img: p5Types.Image | undefined;
}

interface Planet {
  name: string;
  distance: number;
  radius: number;
  speed: number;
  angle: number;
  img: p5Types.Image | undefined;
  position?: p5Types.Vector;
}
interface SolarSystemProps {
  selectedPlanetRef: MutableRefObject<string | null>
}

export default function SolarSystem(props: SolarSystemProps): JSX.Element {
  let myCamera: p5Types.Camera;
  let cameraTarget: Planet | null = null;
  let isSpeedFlexible = false;

  const stars: Star[] = [];
  const sun: Sun = {
    name: "Sun",
    distance: 0,
    radius: 100,
    img: undefined,
  };
  const planets: Planet[] = [
    {
      name: "Mercury",
      distance: 139,
      radius: 5,
      speed: 0.05,
      angle: 0,
      img: undefined,
    },
    {
      name: "Venus",
      distance: 172,
      radius: 12,
      speed: 0.035,
      angle: 1.57,
      img: undefined,
    },
    {
      name: "Earth",
      distance: 200,
      radius: 13,
      speed: 0.029,
      angle: 0.52,
      img: undefined,
    },
    {
      name: "Mars",
      distance: 252,
      radius: 7,
      speed: 0.024,
      angle: 4.71,
      img: undefined,
    },
    {
      name: "Jupiter",
      distance: 600,
      radius: 100,
      speed: 0.013,
      angle: 3.66,
      img: undefined,
    },
    {
      name: "Saturn",
      distance: 900,
      radius: 70,
      speed: 0.009,
      angle: 5.49,
      img: undefined,
    },
    {
      name: "Uranus",
      distance: 1000,
      radius: 25,
      speed: 0.006,
      angle: 2.36,
      img: undefined,
    },
    {
      name: "Neptune",
      distance: 1100,
      radius: 22,
      speed: 0.005,
      angle: 0,
      img: undefined,
    },
  ];
  const moon: Planet = {
    name: "Moon",
    distance: 20,
    radius: 3,
    speed: 0.05,
    angle: 0,
    img: undefined,
  };
  const preload = (p5: p5Types) => {
    sun.img = p5.loadImage("https://i.postimg.cc/0NbzSXtw/sunmap.jpg");
    planets[0].img = p5.loadImage(
      "https://i.postimg.cc/JzTyGCQ8/mercurymap.jpg"
    );
    planets[1].img = p5.loadImage("https://i.postimg.cc/zGDbzGKp/venusmap.jpg");
    planets[2].img = p5.loadImage(
      "https://i.postimg.cc/sg3SMcdY/earthmap1k.jpg"
    );
    planets[3].img = p5.loadImage(
      "https://i.postimg.cc/BQBPfKLX/mars-1k-color.jpg"
    );
    planets[4].img = p5.loadImage(
      "https://i.postimg.cc/FzjdRfTC/jupitermap.jpg"
    );
    planets[5].img = p5.loadImage(
      "https://i.postimg.cc/MHkfq0mj/saturnmap.jpg"
    );
    planets[6].img = p5.loadImage(
      "https://i.postimg.cc/43ShFRKP/uranusmap.jpg"
    );
    planets[7].img = p5.loadImage(
      "https://i.postimg.cc/V600xZn8/neptunemap.jpg"
    );
    moon.img = p5.loadImage("https://i.postimg.cc/cCXDP9JB/moonmap4k.jpg");
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
    drawOrbits(p5);
    drawPlanets(p5);
  };

  const setupCamera = (p5: p5Types) => {
    myCamera = p5.createCamera();
    myCamera.setPosition(0, -400, 1500);
    myCamera.lookAt(0, 0, 0);
  };

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
    // if props has a selected planet but we're not yet tracking it, do so
    if (props.selectedPlanetRef.current && (!cameraTarget || cameraTarget.name !== props.selectedPlanetRef.current)) {
      cameraTarget = findPlanetByName(props.selectedPlanetRef.current);
    }
    // if we have a target, look at it!
    if (cameraTarget && cameraTarget.position && myCamera) {
      myCamera.lookAt(
        cameraTarget.position.x,
        cameraTarget.position.y,
        cameraTarget.position.z
      );
    }
  }
  function toggleInteractiveSpeed() {
    isSpeedFlexible = !isSpeedFlexible;
  }

  function keyPressed(p5: p5Types) {
    if (p5.key === 's') {
      toggleInteractiveSpeed();
    }
  }
  return <Sketch setup={setup} draw={draw} preload={preload} keyPressed={keyPressed} />;
}
