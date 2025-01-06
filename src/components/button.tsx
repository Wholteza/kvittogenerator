import { ReactNode, useMemo } from "react";
import "./button.scss";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  children?: ReactNode;
  className?: string;
  type?: "action"
  icon?: IconDefinition
}

const Button = ({ children, className = "", type = "action", icon }: Props) => {

  const classNames = useMemo<string>(() => {
    const names: string[] = [];
    switch (type) {
      default:
        names.push("button--action")
    }
    return names.join(" ");

  }, [type])
  return <button className={`button ${classNames} ${className}`}><>{icon ? <FontAwesomeIcon className="icon" icon={icon} /> : <></>}{children}</></button>
}

export default Button;