import { modThree } from "../src/examples/modThree";

function modThreeReference(binary: string): number {
  if (binary.length === 0) return 0;
    return parseInt(binary, 2) % 3;
}

function toBinary(value: number): string {
  return value.toString(2);
}

/**
 * Core tests for representative binary values.
 */
describe("modThree", () => {
  test.each([
    { binary: "", expected: 0 },
    { binary: "0", expected: 0 },
    { binary: "1", expected: 1 },
    { binary: "10", expected: 2 },
    { binary: "11", expected: 0 },
    { binary: "100", expected: 1 },
    { binary: "101", expected: 2 },
    { binary: "110", expected: 0 },
    { binary: "111", expected: 1 },
    { binary: "1001", expected: 0 },
    { binary: "1100", expected: 0 },
  ])("modThree('$binary') returns $expected", 
    ({ binary, expected }) => {
        expect(modThree(binary)).toBe(expected);
  });


  // Leading zeros should not affect the computed remainder.
  test.each([
    { binary:"0011", expected: 0 },
    { binary:"000111", expected:1 },
    { binary:"000", expected:0 },
  ])("modThree('$binary') handles leading zeros and returns $expected", 
    ({ binary, expected }) => {
    expect(modThree(binary)).toBe(expected);
  });

  // Invalid binary strings should throw an error.
  test.each(["2", "10 01", "10a01", "-101"]) (
    "rejects non-binary input: %j",
    (input) => {
    expect(() => modThree(input)).toThrow(/invalid symbol/i);
    }
  );

  // Non-string input should throw an error
  test.each([null, undefined, 101])("rejects non-string input: %j", (input) => {
    expect(() => modThree(input as unknown as string)).toThrow("Input must be a string");
  });

  // Verifies the correctness for all 8-bit values (0-255)
  test("modThree matches numeric reference for values 0–255", () => {
    for (let value = 0; value < 256; value++) {
      const binary = toBinary(value);
      expect(modThree(binary)).toBe(modThreeReference(binary));
    }
  });
});
