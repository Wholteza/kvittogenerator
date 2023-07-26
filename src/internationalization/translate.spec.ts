import translate from "./translate";

describe("translate", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("returns the original string if it is not a key of dictionary", () => {
    // arrange
    const keyNotInDictionary = "key not in dictionary";

    // act
    const result = translate(keyNotInDictionary);

    // assert
    expect(result).toBe(keyNotInDictionary);
  });
  it("returns the translation of the string if it is a key of the dictionary", () => {
    // arrange
    const keyInDictionary = "Name";
    const translation = "Namn";

    // act
    const result = translate(keyInDictionary);

    // assert
    expect(result).toBe(translation);
  });
});
