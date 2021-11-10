import Sketch from "react-p5";
import p5Types from "p5"; //Import this for typechecking and intellisense
import SunTextureData from './SunTextureData.json'

// interface ComponentProps {
//   //Your component props
// }

interface Star {
  x: number;
  y: number;
  z: number;
}

export default function SolarSystem(): JSX.Element {
  let myCamera;
  let sunImage: p5Types.Image;
  const stars: Star[] = [];
  const sun = { name: "Sun", distance: 0, radius: 100 };
  const planets = [
    { name: "Mercury", distance: 139, radius: 5, speed: 0.05, angle: 0 },
    { name: "Venus", distance: 172, radius: 12, speed: 0.035, angle: 1.57 },
    { name: "Earth", distance: 200, radius: 13, speed: 0.029, angle: 0.52 },
    { name: "Mars", distance: 252, radius: 7, speed: 0.024, angle: 4.71 },
    { name: "Jupiter", distance: 600, radius: 100, speed: 0.013, angle: 3.66 },
    { name: "Saturn", distance: 900, radius: 70, speed: 0.009, angle: 5.49 },
    { name: "Uranus", distance: 1000, radius: 25, speed: 0.006, angle: 2.36 },
    { name: "Neptune", distance: 1100, radius: 22, speed: 0.005, angle: 0 },
  ];

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.WEBGL);
    createStars(p5);
    // let width;
    // let height;

    //optional
    //Set up a non-default camera position and facing.  You *can* delete these and accept the defaults
    myCamera = p5.createCamera();
    myCamera.setPosition(0, -400, 1500);
    myCamera.lookAt(0, 0, 0);

    //This should really be preloaded, but as a quick hack, we'll 
    //start it loading now and check if it's ready on each frame before trying to use it.
    sunImage = p5.loadImage(SunTextureData);
  };

  const draw = (p5: p5Types) => {
    p5.background(0);
    p5.orbitControl(5, 5);
    p5.directionalLight(p5.color(150, 100, 0), p5.createVector(1, 0, -1));

    p5.ambientLight(180, 150, 150);

    p5.noStroke();

    drawStars(p5);
    drawSun(p5);
    drawOrbits(p5);
    drawPlanets(p5);
  };

  const drawSun = (p5: p5Types) => {
    if (sunImage) {  //loaded yet?
      p5.texture(sunImage);
    } else {
      p5.ambientMaterial(p5.color("#ed6663"));
    }
    p5.sphere(sun.radius);
  };

  const drawPlanets = (p5: p5Types) => {
    for (const planet of planets) {
      p5.push();
      planet.angle = drawPlanet(
        p5,
        planet.distance,
        planet.radius,
        planet.speed,
        planet.angle
      );
      p5.pop();
    }
  };

  function drawPlanet(
    p5: p5Types,
    distance: number,
    radius: number,
    speed: number,
    angle: number
  ) {
    const x = distance * p5.cos(angle);
    const y = distance * p5.sin(angle);

    p5.translate(x, 0, y);
    angle += speed;
    p5.ambientMaterial(p5.color("#e93dc8"));
    p5.sphere(radius);
    return angle;
  }

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
    p5.ellipse(0, 0, distance * 2);
  }

  const createStars = (p5: p5Types) => {
    for (let i = 0; i < 1300; i++) {
      const star = {
        x: p5.random(-1300, 1300),
        y: p5.random(-1300, 1300),
        z: p5.random(-1300, 1300),
      };
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
    p5.sphere(1);
  }

  return <Sketch setup={setup} draw={draw} />;
}
