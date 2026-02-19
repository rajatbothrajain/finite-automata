import { FiniteAutomation } from "../fsm/FiniteAutomation";

type BinarySymbol = "0" | "1";

const alphabet: BinarySymbol[] = ["0", "1"];

/**
 * Creates a generic FSM that computes n mod `modulus` for any binary string.
 *
 * Uses the formula: next = (2 * state + bit), reducing with if (next >= modulus) next -= modulus
 * examples :
 * createBinaryModFSM(3).run("110") // => 0  (6 mod 3 = 0)
 * createBinaryModFSM(5).run("110") // => 1  (6 mod 5 = 1)
 * createBinaryModFSM(7).run("110") // => 6  (6 mod 7 = 6)
 */
export function createBinaryModFSM(modulus: number): FiniteAutomation<number, BinarySymbol> {
  if (!Number.isInteger(modulus) || modulus <= 0) {
    throw new Error("Modulus must be a positive integer");
  }

  const states = Array.from({ length: modulus }, (_, i) => i);

  return new FiniteAutomation<number, BinarySymbol>({
    states,
    alphabet,
    initialState: 0,
    acceptStates: states,
    transitionFn: (state, symbol) => {
      const bit = symbol === "1" ? 1 : 0;
      let next = 2 * state + bit;

      // next ≤ 2*(modulus−1)+1 = 2*modulus−1, so it can exceed
      // modulus by at most (modulus−1), meaning one subtraction
      if (next >= modulus) next -= modulus;
      return next;
    },
  });
}