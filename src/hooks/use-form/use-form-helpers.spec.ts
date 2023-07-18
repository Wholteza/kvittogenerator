import * as dynamicObjectHelpersModule from "../../helpers/dynamic-object-helpers";
import { DynamicPropertyInformation } from "../../helpers/dynamic-object-helpers";
import {
  getNewInstanceWithUpdatedProp,
  getPsuedoRandomKey,
} from "./use-form-helpers";

import * as parseWithHydrationModule from "../../helpers/parse-helpers";

describe("getFormValueBasedOnPropertyInformation", () => {
  it("", () => {
    expect(true).toBe(false);
  });
});

describe("getPsuedoRandomKey", () => {
  it("generates a lot of of keys which are all unique", () => {
    // arrange
    const amountOfGeneratedKeys = 10_000;
    const keys = new Array<string>(amountOfGeneratedKeys)
      .fill("test")
      .map(() => getPsuedoRandomKey());

    // act
    const uniqueKeys = new Set<string>(keys);

    // asserst
    expect(uniqueKeys.size).toBe(amountOfGeneratedKeys);
  });
});

describe("getNewInstanceWithUpdatedProp", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("passes the parameters to its dependencies and returns the result", () => {
    // arrange
    const input = { value: "arst" };
    const propToUpdate: DynamicPropertyInformation = {
      name: "value",
      propertyPath: ["value"],
      type: "string",
    };
    const newValue = "tsra";

    const parseWithHydrationSpy = jest
      .spyOn(parseWithHydrationModule, "parseWithDateHydration")
      .mockReturnValue(input);
    const mutatePropOnPathSpy = jest
      .spyOn(dynamicObjectHelpersModule, "mutatePropOnPath")
      .mockImplementation(() => ({}));

    // act
    const result = getNewInstanceWithUpdatedProp(input, propToUpdate, newValue);

    // assert
    expect(result).toBe(input);
    expect(parseWithHydrationSpy).toHaveBeenCalledWith(JSON.stringify(input));
    expect(mutatePropOnPathSpy).toHaveBeenCalledWith(
      input,
      propToUpdate.propertyPath,
      newValue
    );
  });
});

describe("getTypedValueFromEvent", () => {
  it("needs to be tested", () => {
    expect(true).toBe(false);
  });
});
