import { parseWithDateHydration } from "./parse-helpers";

describe("parseWithDateHydration", () => {
  it("parses stringified json objects with primitive values", () => {
    // arrange
    type TestType = {
      null: null;
      undefined: undefined;
      boolean: boolean;
      number: number;
      string: string;
    };
    const input: TestType = {
      null: null,
      undefined: undefined,
      boolean: true,
      number: 1.1,
      string: "string",
    };

    // act
    const result = parseWithDateHydration<TestType>(JSON.stringify(input));

    // assert
    expect(result.null).toBe(input.null);
    expect(result.undefined).toBe(input.undefined);
    expect(result.boolean).toBe(input.boolean);
    expect(result.number).toBe(input.number);
    expect(result.string).toBe(input.string);
  });
  it("parses stringified date in object to instance of date", () => {
    // arrange
    type TestType = {
      date: Date;
    };
    const input: TestType = {
      date: new Date(Date.now()),
    };

    // act
    const result = parseWithDateHydration<TestType>(JSON.stringify(input));

    // assert
    expect(result.date.toISOString()).toBe(input.date.toISOString());
  });
  it("parses nested object", () => {
    // arrange
    type NestedTestType = {
      value: string;
    };
    type TestType = {
      value: NestedTestType;
    };

    const input: TestType = {
      value: { value: "arst" },
    };

    // act
    const result = parseWithDateHydration<TestType>(JSON.stringify(input));

    // assert
    expect(result).toBeDefined();
    expect(result.value).toBeDefined();
    expect(result.value.value).toBe(input.value.value);
  });
  it("parses nested array", () => {
    // arrange
    type TestType = {
      value: string[];
    };

    const input: TestType = {
      value: ["one", "two"],
    };

    // act
    const result = parseWithDateHydration<TestType>(JSON.stringify(input));

    // assert
    expect(result).toBeDefined();
    expect(result.value).toBeDefined();
    expect(result.value[0]).toBe(input.value[0]);
    expect(result.value[1]).toBe(input.value[1]);
  });
});
