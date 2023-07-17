import {
  DynamicPropertyInformation,
  generatePropertyInformation,
  getValueOnPath,
  mutatePropOnPath,
} from "./dynamic-object-helpers";

describe("mutatePropOnPath", () => {
  it("mutates prop on shallow path provided to provided value", () => {
    // arrange
    const dynamicObject: Record<string, string> = {
      value: "arst",
    };
    const shallowPath = ["value"];
    const newValue = "tsra";

    // act
    mutatePropOnPath(
      dynamicObject as Record<string, never>,
      shallowPath,
      newValue
    );

    // assert
    expect(dynamicObject.value).toBe(newValue);
  });
  it("mutates prop on deep path provided to provided value", () => {
    // arrange
    const dynamicObject = { deep: { path: { value: "arst" } } };
    const deepPath = ["deep", "path", "value"];
    const newValue = "tsra";

    // act
    mutatePropOnPath(
      dynamicObject as Record<string, object> as Record<string, never>,
      deepPath,
      newValue
    );

    // assert
    expect(dynamicObject.deep.path.value).toBe(newValue);
  });
});

describe("getValueOnPath", () => {
  it("returns value of shallow prop", () => {
    // arrange
    const dynamicObject = { value: "arst" };
    const path = ["value"];

    // act
    const result = getValueOnPath(
      dynamicObject as Record<string, string> as Record<string, never>,
      path
    );

    // assert
    expect(result).toBe(dynamicObject.value);
  });
  it("returns value of deep prop", () => {
    // arrange
    const dynamicObject = { deep: { path: { value: "arst" } } };
    const path = ["deep", "path", "value"];

    // act
    const result = getValueOnPath(
      dynamicObject as Record<string, object> as Record<string, never>,
      path
    );

    // assert
    expect(result).toBe(dynamicObject.deep.path.value);
  });
});

describe("generatePropertyInformation", () => {
  it("returns information about shallow prop", () => {
    // arrange
    const dynamicObject = { value: "arst" };
    const expectedInformation: DynamicPropertyInformation = {
      name: "value",
      propertyPath: ["value"],
      type: "string",
    };

    // act
    const result = generatePropertyInformation(
      dynamicObject as Record<string, string> as Record<string, never>
    );

    // assert
    expect(result).toContainEqual(expectedInformation);
  });
  it("returns the correct type for string", () => {
    // arrange
    const dynamicObject = { value: "arst" };
    const expectedInformation: DynamicPropertyInformation = {
      name: "value",
      propertyPath: ["value"],
      type: "string",
    };

    // act
    const result = generatePropertyInformation(
      dynamicObject as Record<string, string> as Record<string, never>
    );

    // assert
    expect(result).toContainEqual(expectedInformation);
  });
  it("returns the correct type for number", () => {
    // arrange
    const dynamicObject = { value: 1 };
    const expectedInformation: DynamicPropertyInformation = {
      name: "value",
      propertyPath: ["value"],
      type: "number",
    };

    // act
    const result = generatePropertyInformation(
      dynamicObject as Record<string, number> as Record<string, never>
    );

    // assert
    expect(result).toContainEqual(expectedInformation);
  });
  it("returns the correct type for date", () => {
    // arrange
    const dynamicObject = { value: new Date(Date.now()) };
    const expectedInformation: DynamicPropertyInformation = {
      name: "value",
      propertyPath: ["value"],
      type: "date",
    };

    // act
    const result = generatePropertyInformation(
      dynamicObject as Record<string, Date> as Record<string, never>
    );

    // assert
    expect(result).toContainEqual(expectedInformation);
  });
  it("returns infomation about each value in array", () => {
    // arrange
    const dynamicObject = { value: ["first", "second"] };
    const expectedInformationOne: DynamicPropertyInformation = {
      name: "0",
      propertyPath: ["value", "0"],
      type: "string",
    };
    const expectedInformationTwo: DynamicPropertyInformation = {
      name: "1",
      propertyPath: ["value", "1"],
      type: "string",
    };

    // act
    const result = generatePropertyInformation(
      dynamicObject as Record<string, object> as Record<string, never>
    );

    // assert
    expect(result).toContainEqual(expectedInformationOne);
    expect(result).toContainEqual(expectedInformationTwo);
  });
  it("throws if type support isn't implemented", () => {
    // arrange
    const dynamicObject = { value: true };

    // act
    const action = () =>
      generatePropertyInformation(
        dynamicObject as Record<string, boolean> as Record<string, never>
      );

    // assert
    expect(action).toThrowError();
  });
  it("returns information about deep prop", () => {
    // arrange
    const dynamicObject = { deep: { prop: { value: "string" } } };
    const expectedInformation: DynamicPropertyInformation = {
      name: "value",
      propertyPath: ["deep", "prop", "value"],
      type: "string",
    };

    // act
    const result = generatePropertyInformation(
      dynamicObject as Record<string, object> as Record<string, never>
    );

    // assert
    expect(result).toContainEqual(expectedInformation);
  });
  it("returns information about sibling to deep prop", () => {
    // arrange
    const dynamicObject = {
      deep: { prop: { value: "string" }, sibling: "sibling" },
    };
    const expectedInformation: DynamicPropertyInformation = {
      name: "sibling",
      propertyPath: ["deep", "sibling"],
      type: "string",
    };

    // act
    const result = generatePropertyInformation(
      dynamicObject as Record<string, object> as Record<string, never>
    );

    // assert
    expect(result).toContainEqual(expectedInformation);
  });
});
