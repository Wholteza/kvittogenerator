import { render, screen } from "@testing-library/react";
import useForm from "./use-form";
import * as translateModule from "../translate";

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

const TestComponent = <T,>({ input }: { input: T }) => {
  const [form] = useForm<T>(getPsuedoRandomKey(), input);

  return <>{form}</>;
};

describe("use-form ui tests", () => {
  beforeEach(() => {
    jest
      .spyOn(translateModule, "default")
      .mockImplementation((value: string) => value);
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  test("it renders one input element per property", () => {
    const input: TestType = {
      number: 999,
      string: "description",
      date: new Date(Date.now()),
    };

    render(<TestComponent input={input} />);

    Object.keys(input).forEach((property) => {
      expect(screen.getByLabelText(property)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(property)).toBeInTheDocument();
    });
  });

  test("it renders a text input for strings", () => {
    const key = "string";
    const input: { [key]: string } = {
      [key]: "description",
    };

    render(<TestComponent input={input} />);

    expect(screen.getByPlaceholderText(key)).toHaveProperty("type", "text");
  });

  test("it renders a number input for numbers", () => {
    const key = "number";
    const input: { [key]: number } = {
      [key]: 1,
    };

    render(<TestComponent input={input} />);

    expect(screen.getByPlaceholderText(key)).toHaveProperty("type", "number");
  });

  test("it renders a date input for dates", () => {
    const key = "date";
    const input: { [key]: Date } = {
      [key]: new Date(Date.now()),
    };

    render(<TestComponent input={input} />);

    expect(screen.getByPlaceholderText(key)).toHaveProperty("type", "date");
  });
});
