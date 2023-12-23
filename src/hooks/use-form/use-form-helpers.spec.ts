import * as dynamicObjectHelpersModule from "../../helpers/dynamic-object-helpers";
import { DynamicPropertyInformation } from "../../helpers/dynamic-object-helpers";
import {
  getFormValueBasedOnPropertyInformation,
  getNewInstanceWithUpdatedProp,
  getPsuedoRandomKey,
  getTypedValueFromEvent,
} from "./use-form-helpers";

import * as parseWithHydrationModule from "../../helpers/parse-helpers";

describe("getFormValueBasedOnPropertyInformation", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("returns the result of getValueOnPath if the type is string", () => {
    // arrange
    const information: DynamicPropertyInformation = {
      name: "arst",
      type: "string",
      propertyPath: ["arst"],
    };
    const dynamicObject: Record<string, string> = { arst: "arst" };
    const expectedValue = dynamicObject[information.name];
    const spy = jest.spyOn(dynamicObjectHelpersModule, "getValueOnPath");
    spy.mockReturnValue(expectedValue);

    // act
    const result = getFormValueBasedOnPropertyInformation(
      information,
      dynamicObject as Record<string, never>
    );

    // assert
    expect(result).toBe(expectedValue);
    expect(spy).toHaveBeenCalledWith(dynamicObject, information.propertyPath);
  });
  it("returns the result of getValueOnPath if the type is string", () => {
    // arrange
    const information: DynamicPropertyInformation = {
      name: "arst",
      type: "number",
      propertyPath: ["arst"],
    };
    const dynamicObject: Record<string, number> = { arst: 1 };
    const expectedValue = dynamicObject[information.name];
    const spy = jest.spyOn(dynamicObjectHelpersModule, "getValueOnPath");
    spy.mockReturnValue(expectedValue);

    // act
    const result = getFormValueBasedOnPropertyInformation(
      information,
      dynamicObject as Record<string, never>
    );

    // assert
    expect(result).toBe(expectedValue);
    expect(spy).toHaveBeenCalledWith(dynamicObject, information.propertyPath);
  });
  it("returns the result of getValueOnPath converted into locale date string if the type is date", () => {
    // arrange
    const information: DynamicPropertyInformation = {
      name: "arst",
      type: "date",
      propertyPath: ["arst"],
    };
    const dynamicObject: Record<string, Date> = {
      arst: new Date(Date.now()),
    };
    const expectedValue = dynamicObject[information.name];
    const spy = jest.spyOn(dynamicObjectHelpersModule, "getValueOnPath");
    spy.mockReturnValue(expectedValue);

    // act
    const result = getFormValueBasedOnPropertyInformation(
      information,
      dynamicObject as Record<string, never>
    );

    // assert
    expect(result).toBe(expectedValue.toLocaleDateString("sv-SE"));
    expect(spy).toHaveBeenCalledWith(dynamicObject, information.propertyPath);
  });
  it("throws if type is anything but the implemented ones", () => {
    // arrange
    const information: DynamicPropertyInformation = {
      name: "arst",
      type: "Not Implemented",
      propertyPath: [],
    };

    // act
    const action = () =>
      getFormValueBasedOnPropertyInformation(information, {});

    // assert
    expect(action).toThrowError();
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
  it("returns the valueAsDate property from the change event if the type is date", () => {
    // arrange
    const expected = new Date(Date.now());
    const event = createFakeHTMLInputElementEvent();
    event.target = { valueAsDate: expected } as HTMLInputElement;

    const field: DynamicPropertyInformation = {
      name: "arst",
      propertyPath: [],
      type: "date",
    };

    // act
    const result = getTypedValueFromEvent(field, event);

    // assert
    expect(result).toBe(expected);
  });

  it("returns the valueAsNumber property from the change event if the type is number", () => {
    // arrange
    const expected = 1;
    const event = createFakeHTMLInputElementEvent();
    event.target = { valueAsNumber: expected } as HTMLInputElement;

    const field: DynamicPropertyInformation = {
      name: "arst",
      propertyPath: [],
      type: "number",
    };

    // act
    const result = getTypedValueFromEvent(field, event);

    // assert
    expect(result).toBe(expected);
  });

  it("returns the value property from the change event if the type is anything but number or date", () => {
    // arrange
    const expected = "arst";
    const event = createFakeHTMLInputElementEvent();
    event.target = { value: expected } as HTMLInputElement;

    const field: DynamicPropertyInformation = {
      name: "arst",
      propertyPath: [],
      type: "string",
    };

    // act
    const result = getTypedValueFromEvent(field, event);

    // assert
    expect(result).toBe(expected);
  });
});

const createFakeHTMLInputElementEvent =
  (): React.ChangeEvent<HTMLInputElement> => ({
    bubbles: false,
    cancelable: false,
    currentTarget: {} as HTMLInputElement,
    defaultPrevented: false,
    eventPhase: 0,
    isDefaultPrevented: () => false,
    isPropagationStopped: () => false,
    isTrusted: false,
    nativeEvent: {} as Event,
    persist: () => false,
    preventDefault: () => false,
    stopPropagation: () => false,
    target: {} as HTMLInputElement,
    timeStamp: 0,
    type: "type",
  });
