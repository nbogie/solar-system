import "./Planet.css";

interface Props {
  name: string;
  isSelected: boolean;
  onClick: (name: string) => void;
}

export default function Planet(props: Props): JSX.Element {
  return (
    <li
      className={"Planet" + (props.isSelected ? ' selected' : '')}
      onClick={() => props.onClick(props.name)}
    > {props.name}
    </li >
  );
}
