import { getPsuedoRandomKey } from "./use-form-helpers";

describe("getFormValueBasedOnPropertyInformation", () => {
  it("needs to be tested", () => {
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
  it("needs to be tested", () => {
    expect(true).toBe(false);
  });
});

describe("getTypedValueFromEvent", () => {
  it("needs to be tested", () => {
    expect(true).toBe(false);
  });
});
