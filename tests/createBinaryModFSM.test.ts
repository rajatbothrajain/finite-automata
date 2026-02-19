import { createBinaryModFSM } from "../src/automata/createBinaryModFSM";

function modReference(binary: string, modulus: number): number {
  if (binary.length === 0) return 0;
  return parseInt(binary, 2) % modulus;
}

function toBinary(value: number): string {
  return value.toString(2);
}


// Input Validation
describe("createModFSM – input validation", () => {
  test.each([0, -1, -5,])(
    "throws for non-positive modulus: %i",
    (modulus) => {
      expect(() => createBinaryModFSM(modulus)).toThrow(
        "Modulus must be a positive integer"
      );
    }
  );

  test.each([1.5, 2.7, NaN, Infinity])(
    "throws for non-integer modulus: %s",
    (modulus) => {
      expect(() => createBinaryModFSM(modulus)).toThrow(
        "Modulus must be a positive integer"
      );
    }
  );
});

// Invalid input symbols
describe("createModFSM - invalid input", () => {
  const fsm = createBinaryModFSM(3);

  it("throws for non-binary characters", () => {
    const invalidInputs = ["2", "10a01", "abc", "10 01", "-101"];

    invalidInputs.forEach((input) => {
      expect(() => fsm.run(input)).toThrow(/invalid symbol/i);
    });
  });
});

// Core Correctness validate mod for : 1,2,3,5,7
describe("createModFSM - correctness", () => {
  const moduli = [1, 2, 3, 5, 7];

  moduli.forEach((modulus) => {
    describe(`mod ${modulus}`, () => {
      const fsm = createBinaryModFSM(modulus);

      it("returns 0 for empty string", () => {
        expect(fsm.run("")).toBe(0);
      });

      // Verifies the correctness for all 8-bit values (0-255)
      it("Matches reference implementation for values 0–255", () => {
        for (let value = 0; value <= 255; value++) {
          const binary = toBinary(value);
          const expected = modReference(binary, modulus);

          expect(fsm.run(binary)).toBe(expected);
        }
      });

      it("Leading zeros", () => {
        for (let value = 0; value <= 50; value++) {
          const binary = toBinary(value);
          const padded = "000" + binary;

          expect(fsm.run(padded)).toBe(modReference(binary, modulus));
        }
      });
    });
  });
});