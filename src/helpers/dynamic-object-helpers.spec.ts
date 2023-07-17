import { getValueOnPath, mutatePropOnPath } from "./dynamic-object-helpers";

describe("mutatePropOnPath", () => {
  it("mutates prop on shallow path provided to provided value", () => {
    // arrange
    const dynamicObject = { value: "arst" };
    const shallowPath = ["value"];
    const newValue = "tsra";

    // act
    mutatePropOnPath(dynamicObject, shallowPath, newValue);

    // assert
    expect(dynamicObject.value).toBe(newValue);
  });
  it("mutates prop on deep path provided to provided value", () => {
    // arrange
    const dynamicObject = { deep: { path: { value: "arst" } } };
    const deepPath = ["deep", "path", "value"];
    const newValue = "tsra";

    // act
    mutatePropOnPath(dynamicObject, deepPath, newValue);

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
    const result = getValueOnPath(dynamicObject, path);

    // assert
    expect(result).toBe(dynamicObject.value);
  });
  it("returns value of deep prop", () => {
    // arrange
    const dynamicObject = { deep: { path: { value: "arst" } } };
    const path = ["deep", "path", "value"];

    // act
    const result = getValueOnPath(dynamicObject, path);

    // assert
    expect(result).toBe(dynamicObject.deep.path.value);
  });
});
