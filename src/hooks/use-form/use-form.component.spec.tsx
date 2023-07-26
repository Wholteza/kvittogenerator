import { render, screen, fireEvent, createEvent } from "@testing-library/react";
import useForm from "./use-form";
import * as translateModule from "../../internationalization/translate";
import { getPsuedoRandomKey } from "./use-form-helpers";

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

  test("the value of a string input changes when you type into it", async () => {
    // arrange
    const key = "string";
    const initialValue = "arst";
    const expectedValue = "something else";
    const input: { [key]: string } = {
      [key]: initialValue,
    };

    // act
    render(<TestComponent input={input} />);
    const inputElement = screen.getByPlaceholderText(key);

    fireEvent(
      inputElement,
      createEvent("change", inputElement, { target: { value: expectedValue } })
    );

    //assert
    expect(screen.getByPlaceholderText(key)).toHaveProperty(
      "value",
      expectedValue
    );
  });

  test("the value of a number input changes when you type into it", async () => {
    const key = "number";
    const initialValue = 1;
    const expectedValue = 9;
    const input: { [key]: number } = {
      [key]: initialValue,
    };

    // act
    render(<TestComponent input={input} />);
    const inputElement = screen.getByPlaceholderText(key);

    fireEvent(
      inputElement,
      createEvent("change", inputElement, {
        target: { valueAsNumber: expectedValue },
      })
    );

    expect(screen.getByPlaceholderText(key)).toHaveProperty(
      "value",
      expectedValue.toString()
    );
  });

  test("the value of a date input changes when you type into it", async () => {
    const key = "date";
    const initialValue = new Date("2023-01-01");
    const expectedValue = new Date("2023-02-02");
    const input: { [key]: Date } = {
      [key]: initialValue,
    };

    // act
    render(<TestComponent input={input} />);
    const inputElement = screen.getByPlaceholderText(key);

    fireEvent(
      inputElement,
      createEvent("change", inputElement, {
        target: { valueAsDate: expectedValue },
      })
    );

    expect(screen.getByPlaceholderText(key)).toHaveProperty(
      "value",
      Intl.DateTimeFormat("SE-sv").format(expectedValue)
    );
  });
});
