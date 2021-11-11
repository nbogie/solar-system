import "./NavBar.css";
import Planet from "./Planet";
interface NavBarProps {
  handlePlanetNameClick: (name: string) => void;
}
export default function NavBar(props: NavBarProps): JSX.Element {
  return (
    <nav className="NavBar">
      <ul>
        <Planet name={"Mercury"} onClick={props.handlePlanetNameClick} />
        <Planet name={"Venus"} onClick={props.handlePlanetNameClick} />
        <Planet name={"Earth"} onClick={props.handlePlanetNameClick} />
        <Planet name={"Mars"} onClick={props.handlePlanetNameClick} />
        <Planet name={"Jupiter"} onClick={props.handlePlanetNameClick} />
        <Planet name={"Saturn"} onClick={props.handlePlanetNameClick} />
        <Planet name={"Uranus"} onClick={props.handlePlanetNameClick} />
        <Planet name={"Neptune"} onClick={props.handlePlanetNameClick} />
      </ul>
    </nav>
  );
}
