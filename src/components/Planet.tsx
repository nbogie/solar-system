import "./Planet.css";

interface Props {
  name: string;
  onClick: (name: string) => void;
}

export default function Planet(props: Props): JSX.Element {
  return (
    <li
      className="Planet"
      onClick={() => props.onClick(props.name)}
    >{props.name}
    </li>
  );
}
