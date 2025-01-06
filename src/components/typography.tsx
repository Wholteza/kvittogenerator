import { useMemo } from "react";
import "./typography.scss";

type Props = {
  children: React.ReactNode;
  type?: "normal" | "bold";
  className?: string;
  size?: "small" | "normal" | "large" | "subheading" | "heading";
  paragraph?: boolean;
  uppercase?: boolean;
  capitalize?: boolean;
};

const Typography = ({
  children: text,
  type = "normal",
  className,
  size = "normal",
  paragraph,
  uppercase,
  capitalize,
}: Props) => {
  const classNames = useMemo<string>(() => {
    const names: string[] = ["typography"];

    names.push(type === "normal" ? "typography-normal" : "typography-bold");

    switch (size) {
      case "small":
        names.push("typography-size-small");
        break;
      case "large":
        names.push("typography-size-large");
        break;
      case "subheading":
        names.push("typography-size-subheading");
        break;
      case "heading":
        names.push("typography-size-heading");
        break;
      default:
        names.push("typography-size-normal");
    }

    paragraph && names.push("typography-paragraph");
    uppercase && names.push("typography-uppercase");
    capitalize && names.push("typography-capitalize");

    className && names.push(className);

    return names.join(" ");
  }, [className, type, size, uppercase, capitalize, paragraph]);

  return <span className={classNames}>{text}</span>;
};

export default Typography;
