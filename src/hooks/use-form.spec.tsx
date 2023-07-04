import { render, screen } from "@testing-library/react";
import useForm from "./use-form";
import translate from "../translate";

const getPsuedoRandomKey = (): string =>
  btoa(
    new Array(1000)
      .map(() => Math.random())
      .reduce((aggregate, current) => aggregate * current, Math.random() + 1)
      .toString()
  );

type TestType = {
  string: string;
  number: number;
  date: Date;
};

const TestComponent = ({ input }: { input: TestType }) => {
  const [form] = useForm<TestType>(getPsuedoRandomKey(), input);

  return <>{form}</>;
};

describe("use-form ui tests", () => {
  test("it renders one input element per property", () => {
    const input: TestType = {
      number: 999,
      string: "description",
      date: new Date(Date.now()),
    };

    render(<TestComponent input={input} />);

    Object.keys(input).forEach((property) => {
      expect(screen.getByLabelText(translate(property))).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(translate(property))
      ).toBeInTheDocument();
    });
  });
});
