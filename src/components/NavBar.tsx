import "./NavBar.css";
import Planet from "./Planet";
interface NavBarProps {
  handlePlanetNameClick: (name: string) => void;
  selectedPlanet: string | null;
}
export default function NavBar(props: NavBarProps): JSX.Element {
  return (
    <nav className="NavBar">
      <ul>
        {
          ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"]
            .map(name => <Planet
              name={name}
              key={name}
              isSelected={name === props.selectedPlanet}
              onClick={props.handlePlanetNameClick}
            />)
        }

      </ul>
    </nav>
  );
}
